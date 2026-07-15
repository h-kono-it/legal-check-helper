import { defineConfig } from "blume";

export default defineConfig({
  title: "法務案件チェックポイント",
  description:
    "「作る機能」「売る商材」から疑うべき法令を逆引きする、エンジニアのための法務・経理リファレンス",
  content: {
    root: "docs",
  },
  // アナリティクス未設定の静的サイトではクリックが集計されず何も保存されないため、
  // 意味のないUIになる「Was this page helpful?」ウィジェットを無効化する
  feedback: false,
});
