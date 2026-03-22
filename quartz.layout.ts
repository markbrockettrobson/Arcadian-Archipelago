import { PageLayout, SharedLayout } from "./quartz/cfg";
import * as Component from "./quartz/components";

const comments = Component.Comments({
  provider: "giscus",
  options: {
    repo: "markbrockettrobson/Arcadian-Archipelago",
    repoId: "R_kgDOReM8zQ",
    category: "Giscus",
    categoryId: "DIC_kwDOReM8zc4C3q0d",
    mapping: "pathname",
    strict: false,
    reactionsEnabled: true,
    inputPosition: "top",
    lang: "en",
  },
});

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [comments],
  footer: Component.Footer({
    links: {
      "Campaign Home": "https://github.com/markbrockettrobson/Arcadian-Archipelago",
      "Pathfinder 2e": "https://2e.aonprd.com/",
      "Powered by Quartz": "https://quartz.jzhao.xyz/",
    },
  }),
};

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "Campaign Vault",
      filterFn: (node) => !node.data?.tags?.includes("nav-exclude"),
    }),
  ],
  right: [
    Component.Graph({
      localGraph: {
        showTags: false,
      },
      globalGraph: {
        showTags: false,
      },
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
};

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "Campaign Vault",
      filterFn: (node) => !node.data?.tags?.includes("nav-exclude"),
    }),
  ],
  right: [],
};
