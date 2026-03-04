# Arcadian-Archipelago

Public wiki for the Arcadian Archipelago Pathfinder 2e campaign, built with [Quartz](https://quartz.jzhao.xyz/) and served via GitHub Pages.

🌐 **Live site:** https://markbrockettrobson.github.io/Arcadian-Archipelago/

---

## How it works

Content in the `content/` folder is automatically pushed here by the private vault repo whenever notes marked `publish: true` are updated. The deploy workflow then rebuilds and publishes the Quartz site to GitHub Pages.

Do **not** edit files in `content/` manually — they will be overwritten by the next vault export.

## Giscus comments setup (one-time)

1. Enable **Discussions** in this repo (`Settings → General → Features → Discussions`)
2. Install the [giscus GitHub App](https://github.com/apps/giscus) on this repo
3. Create a Discussion category named **`Giscus`**

Giscus IDs are already hardcoded in `quartz.layout.ts` — no further configuration needed.

> To disable comments on a specific note, add `comments: false` to its frontmatter.

## Local development

```bash
# Clone Quartz alongside this repo
git clone https://github.com/jackyzha0/quartz.git .quartz
cd .quartz && npm install && cd ..

# Serve locally
npm run dev
```
