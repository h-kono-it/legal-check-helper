import { defineComponents } from "blume";

export default defineComponents({
  mdx: {
    // /changelog の一覧（docs/90-changelog/index.mdx で使う）。
    // MDX の相対 import に頼らず、ここで登録して import 不要のタグにする
    ChangelogIndex: "./components/ChangelogIndex.astro",
  },
  layout: {
    // 全ページ共通のフッター。免責事項を必ず表示する
    Footer: "./components/SiteFooter.astro",
    // シェアメニュー。上（タイトル直上・逆引き動線用）と下（読了後用）の2箇所
    PageHeader: "./components/ShareMenuTop.astro",
    PageFooter: "./components/ShareMenu.astro",
  },
});
