import { defineConfig } from "blume";

export default defineConfig({
  title: "法務案件チェックポイント",
  description:
    "「作る機能」「売る商材」から疑うべき法令を逆引きする、エンジニアのための法務・経理リファレンス",
  content: {
    root: "docs",
  },
  // 単一ロケール ja。デフォルトロケールはコンテンツルートのまま・URLプレフィックスも
  // 付かないので、URL 構造は変わらない。UI 文言（検索・最終更新・変更履歴など）が
  // 同梱の日本語パックになり、日付表示も日本語圏の形式になる
  i18n: {
    defaultLocale: "ja",
    locales: [{ code: "ja", label: "日本語" }],
  },
  dateFormat: { year: "numeric", month: "2-digit", day: "2-digit" },
  navigation: {
    // 機能ページはカテゴリ配下にネストしているため、折りたためるグループで表示する
    sidebar: { display: "group" },
    // 更新履歴はサイドバーではなくヘッダーのタブから辿る（本家 useblume.dev と同じ構成）。
    // タブを設定するとナビツリーがタブごとに分割され、changelog エントリは
    // ドキュメント側のサイドバーに現れなくなる
    tabs: [
      { label: "ドキュメント", path: "/" },
      { label: "更新履歴", path: "/changelog" },
    ],
  },
  seo: {
    x: { handle: "@hk_it7", creator: "@hk_it7" },
    og: {
      enabled: true, // or false to opt out even with a site set
      // OG カードの日本語豆腐対策（blume#62 → 1.1.0 の seo.og.fonts で解決）。
      // ビルド時に Google Fonts から取得される。カードの本文は fontWeight 400/600 を使う
      fonts: [{ name: "Noto Sans JP", weight: [400, 600] }],
    },
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
  // 各ページに git 履歴由来の「最終更新」を表示する。法令を扱うサイトなので
  // 「このページはいつ時点の情報か」を読者が判断できるようにする。
  // CI では actions/checkout の fetch-depth: 0 が前提（浅いクローンだと全ページが
  // デプロイ日になってしまう）。deploy.yml 側に設定済み。
  lastModified: true,
});
