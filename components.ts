import { defineComponents } from "blume";

export default defineComponents({
  layout: {
    // 全ページ共通のフッター。免責事項を必ず表示する
    Footer: "./components/SiteFooter.astro",
    // シェアメニュー。上（タイトル直上・逆引き動線用）と下（読了後用）の2箇所
    PageHeader: "./components/ShareMenuTop.astro",
    PageFooter: "./components/ShareMenu.astro",
  },
});
