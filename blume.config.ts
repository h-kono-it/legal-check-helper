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
  // provider は既定の orama。1.2.0 までは orama のトークナイザが english 固定で
  // 日本語がヒット0件になるため pagefind に逃していたが、1.2.1（[blume#125] の修正）で
  // buildOramaIndex が i18n.defaultLocale からトークナイザを導出するようになった。
  // ja は Intl.Segmenter で分かち書きされるので、provider の指定なしで日本語が引ける。
  //
  // popular は ⌘K を押した直後（何も入力していないとき）に出る一覧。既定はナビツリーを
  // 平坦化した先頭6件で、このサイトだと「一覧」「概要」のようなインデックスページの
  // ラベルが並んで何のページか分からないため、逆引きの入口を手で並べる。
  // href は deployment.base 抜きで書く（クリック時にクライアント側が前置する）。
  // icon は組み込みアイコン名のみ有効（画像や inline SVG は blume doctor が警告する）
  search: {
    popular: [
      { label: "機能から引く", href: "/features", icon: "zap" },
      { label: "商材から引く", href: "/products", icon: "shopping-cart" },
      { label: "フェーズ別チェックリスト", href: "/checklist", icon: "list-checks" },
      { label: "法務相談の準備", href: "/checklist/consulting", icon: "messages-square" },
      { label: "更新履歴", href: "/changelog", icon: "history" },
      { label: "免責事項", href: "/disclaimer", icon: "shield-alert" },
    ],
  },
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
      // 日本語の豆腐対策で以前は fonts に Noto Sans JP を明示していたが、2.0 で
      // 既定のカードフォントスタックに各 script の Noto フォールバックが入ったため
      // 不要になった。指定を外したぶん、ビルド時の Google Fonts 取得もなくなる
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
  // 2.0 で真偽値・オブジェクト形式が廃止され、"git" / "frontmatter" / false の
  // フラット値のみになった（1.x の `true` がこの "git" に相当する）
  lastModified: "git",
});
