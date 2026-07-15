import { defineConfig } from "blume";

export default defineConfig({
  title: "法務案件チェックポイント",
  description:
    "「作る機能」「売る商材」から疑うべき法令を逆引きする、エンジニアのための法務・経理リファレンス",
  content: {
    root: "docs",
  },
  seo: {
    x: { handle: "@hk_it7", creator: "@hk_it7" },
    og: { enabled: true }, // or false to opt out even with a site set
  },
  deployment: {
    site: "https://h-kono-it.github.io/legal-check-helper",
    base: "/legal-check-helper",
  },
  // アナリティクス未設定の静的サイトではクリックが集計されず何も保存されないため、
  // 意味のないUIになる「Was this page helpful?」ウィジェットを無効化する
  feedback: false,
});
