import { defineComponents } from "blume";

export default defineComponents({
  layout: {
    // 全ページ共通のフッター。免責事項を必ず表示する
    Footer: "./components/SiteFooter.astro",
  },
});
