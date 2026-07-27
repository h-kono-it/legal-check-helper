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
  // デフォルトの orama は日本語を検索できない。Orama のトークナイザは言語ごとの
  // 区切り正規表現で分割する方式で、blume はトークナイザを差し替えないため
  // language は english 固定になる。english の splitter（/[^A-Za-z…0-9_'-]+/）は
  // 日本語の文字をすべて区切り扱いにするので、本文も検索語もトークンが空になり
  // ヒット0件になる（ASCII を含む "GDPR" 等だけが引ける）。
  // pagefind は同梱バイナリが pagefind_extended で CJK の分かち書きに対応しており、
  // 出力の <html lang="ja"> から ja のインデックスを作る。トレードオフ:
  //   - 検索はプロダクションビルドでのみ動く（dev はダイアログが「本番ビルドで利用可」表示）
  //   - セクションのフィルタピルが出ない／プレビュー枠が本文でなく抜粋になる
  //   - blume が張るインデックスはページ全体が対象（本来の data-pagefind-body が
  //     出力されていない）ため、本文だけで張り直している。scripts/reindex-search.mjs
  // 本筋の修正は orama 側にトークナイザを差し込む口を用意することなので、upstream に
  // issue を出すまでの暫定対応。
  //
  // popular は ⌘K を押した直後（何も入力していないとき）に出る一覧。既定はナビツリーを
  // 平坦化した先頭6件で、このサイトだと「一覧」「概要」のようなインデックスページの
  // ラベルが並んで何のページか分からないため、逆引きの入口を手で並べる。
  // href は deployment.base 抜きで書く（クリック時にクライアント側が前置する）。
  // icon は組み込みアイコン名のみ有効（画像や inline SVG は blume doctor が警告する）
  search: {
    provider: "pagefind",
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
