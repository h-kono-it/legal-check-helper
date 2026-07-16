import { defineConfig } from "blume";

export default defineConfig({
  title: "法務案件チェックポイント",
  description:
    "「作る機能」「売る商材」から疑うべき法令を逆引きする、エンジニアのための法務・経理リファレンス",
  content: {
    root: "docs",
  },
  navigation: {
    // 機能ページはカテゴリ配下にネストしているため、折りたためるグループで表示する
    sidebar: { display: "group" },
  },
  seo: {
    x: { handle: "@hk_it7", creator: "@hk_it7" },
    og: { enabled: true }, // or false to opt out even with a site set
  },
  deployment: {
    // site はオリジンのみ。base と重複させると OG 画像・canonical URL が
    // 「/legal-check-helper/legal-check-helper/...」のように二重連結され 404 になる
    site: "https://h-kono-it.github.io",
    base: "/legal-check-helper",
  },
  // アナリティクス未設定の静的サイトではクリックが集計されず何も保存されないため、
  // 意味のないUIになる「Was this page helpful?」ウィジェットを無効化する
  feedback: false,
});
