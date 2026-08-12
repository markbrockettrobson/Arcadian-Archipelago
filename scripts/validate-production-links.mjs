import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const outputDirectory = path.resolve(process.argv[2] ?? "public")
const expectedBasePath = "/Arcadian-Archipelago"
const failures = []

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name)
      return entry.isDirectory()
        ? collectHtmlFiles(entryPath)
        : entry.name.endsWith(".html")
          ? [entryPath]
          : []
    }),
  )

  return files.flat()
}

const htmlFiles = await collectHtmlFiles(outputDirectory)

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, "utf8")
  const relativePath = path.relative(outputDirectory, filePath)
  const hasBody = /<body\b/i.test(html)
  const basePathMatch = html.match(/<body\b[^>]*\bdata-basepath(?:="([^"]*)")?[^>]*>/i)
  const actualBasePath = basePathMatch?.[1] ?? ""

  if (hasBody && (!basePathMatch || actualBasePath !== expectedBasePath)) {
    failures.push(
      `${relativePath}: expected body data-basepath="${expectedBasePath}", found "${actualBasePath}"`,
    )
  } else if (!hasBody && !/<meta\s+http-equiv="refresh"/i.test(html)) {
    failures.push(`${relativePath}: expected a rendered page or a meta-refresh redirect`)
  }

  for (const match of html.matchAll(/\b(?:href|src)="(\/[^\"]*)"/gi)) {
    const url = match[1]
    if (
      !url.startsWith("//") &&
      url !== expectedBasePath &&
      !url.startsWith(`${expectedBasePath}/`)
    ) {
      failures.push(`${relativePath}: root-relative URL bypasses the site base path: ${url}`)
    }
  }
}

const canvasPath = path.join(outputDirectory, "factions", "index.canvas.html")
const canvasHtml = await readFile(canvasPath, "utf8").catch(() => null)
if (canvasHtml === null) {
  failures.push("factions/index.canvas.html: canvas page was not generated")
}

const sitemap = await readFile(path.join(outputDirectory, "sitemap.xml"), "utf8").catch(() => "")
const expectedCanvasUrl =
  "https://markbrockettrobson.github.io/Arcadian-Archipelago/factions/index.canvas"
if (!sitemap.includes(expectedCanvasUrl)) {
  failures.push(`sitemap.xml: missing production canvas URL ${expectedCanvasUrl}`)
}

if (failures.length > 0) {
  console.error("Production link validation failed:\n")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  `Production link validation passed for ${htmlFiles.length} HTML files under ${expectedBasePath}.`,
)
