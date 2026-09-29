# Blume 使い方まとめ

[Blume](https://useblume.dev/) は Astro + Vite ベースの Markdown ファーストな静的サイトジェネレーター。
「Fast, AI-ready, zero-config」がコンセプトで、`docs/` に Markdown を置くだけでナビゲーション・検索・テーマ込みのドキュメントサイトが立ち上がる。

- 必要要件: **Node.js 22.12 以上**
- このプロジェクトでの導入済みバージョン: `blume ^2.0.3`（`package.json` 参照）
- **2.0 で検索・デプロイ・コンテンツソース・API リファレンス・アナリティクス・アシスタントの設定が「`blume/*` サブパスから import する adapter」形式に変わった**。1.x のオブジェクト記法は原則エラーになる（このプロジェクトは該当機能をほぼ使っていないため影響は軽微。版ごとの経緯は BLUME-UPGRADES.md）

## CLI コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` (`blume dev`) | ホットリロード付き開発サーバーを起動 |
| `npm run build` (`blume build`) | 静的 HTML と検索インデックスを `dist/` に出力 |
| `npm run doctor` (`blume doctor`) | 設定・コンテンツの診断 |
| `npx blume validate` | 内部リンク・アンカー・アセットの検証 |
| `npx blume audit` | ビルド済み `dist/` の SEO・サイト健全性の監査 |
| `npx blume@latest upgrade` | メジャー更新。`package.json` を上げてインストールし、残る設定変更を行番号付きで列挙する |

2.0 以降、各コマンドは知らないフラグを黙って無視せずエラーにする（`--isolatd` のような打ち間違いが「意図したであろうフラグ」の提案付きで落ちる）。

## ディレクトリ構造とルーティング

`docs/` 配下のファイルパスがそのまま URL になる。

| ファイル | URL |
|---|---|
| `docs/index.mdx` | `/` |
| `docs/quickstart.mdx` | `/quickstart` |
| `docs/guides/theming.mdx` | `/guides/theming` |

- **数字プレフィックス**で並び順を制御できる（URL には現れない）: `01-introduction.mdx` → `/introduction`
- **括弧付きフォルダ**は URL セグメントを増やさずサイドバーをグループ化: `docs/(internal)/security.mdx` → `/security`
- `.md`（GFM + frontmatter）と `.mdx`（+ コンポーネント・ディレクティブ・数式）の両方を使える

## Frontmatter

```yaml
---
title: ページタイトル
description: SEO 用の説明
draft: true          # dev では表示、build では除外
type: doc            # doc（デフォルト） / blog / changelog（RSS 化される）
date: 2026-07-15     # blog/changelog のソート用
sidebar:
  label: 短いラベル   # サイドバー表示名
  icon: rocket
  badge: New
  order: 1
---
```

## ナビゲーション

並び順の優先度（高い順）:

1. `blume.config.ts` の `navigation.sidebar`（明示指定。指定するとファイルシステム自動生成はスキップ）
2. フォルダの `meta.ts` の `pages` 配列
3. 各ページ frontmatter の `sidebar.order`
4. ファイルシステム（index 優先 → 数字プレフィックス → アルファベット順）

### フォルダの meta.ts

```typescript
import { defineMeta } from "blume";
export default defineMeta({
  title: "Guides",
  icon: "book-open",
  pages: ["configuration", "theming", "deployment"],
});
```

### 明示的なサイドバー（config 側）

```typescript
navigation: {
  sidebar: [
    "/",
    { label: "Guides", items: ["/configuration"] },
    { label: "GitHub", href: "https://github.com/..." },
  ],
}
```

グループ表示は `navigation.sidebar.display` で `flat`（デフォルト）/ `group`（折りたたみ）/ `page`（ドリルダウン）を選べる。複数セクションはタブ、バージョン・言語切り替えはセレクタで表現できる。

## MDX コンポーネント（import 不要）

MDX ページでは組み込みコンポーネントを import なしでそのまま使える。

```mdx
<CardGroup cols={2}>
  <Card title="Quickstart" href="/quickstart" icon="rocket">
    説明テキスト
  </Card>
</CardGroup>

<Steps>
  <Step title="インストール">パッケージを追加する。</Step>
  <Step title="ページを書く">`.mdx` を置く。</Step>
</Steps>

<Tabs>
  <Tab title="npm">npm install blume</Tab>
  <Tab title="pnpm">pnpm add blume</Tab>
</Tabs>

<Badge variant="accent">New</Badge>
```

他に Accordion / Expandable / Columns / CodeGroup / Frame / YouTube / Icon / FileTree / Panel / Tooltip / TypeTable / Diff など 30 以上が利用可能。詳細は https://useblume.dev/docs/content/components

## components.ts のレイアウトスロット

`components.ts` の `layout` で差し替え・注入できるスロット一覧（`RootLayout.astro` の `resolveSlot` 呼び出しより。1.1.2 時点）:

- 組み込みを**差し替える**もの: `Header` / `Sidebar` / `MobileNav` / `Breadcrumbs` / `TableOfContents` / `Pagination` / `Feedback`
- デフォルト空で**注入用**のもの: `Footer`（サイト全体の末尾。免責フッターで使用中）/ `PageHeader`（本文の直前＝タイトル直上。シェアメニュー上部版で使用中）/ `PageFooter`（本文の直後・「最終更新」の上。シェアメニュー下部版で使用中）。スロットからカスタム props は渡せないので、同一コンポーネントを設定違いで使うときは薄いラッパーを作る（`ShareMenuTop.astro` 参照）

`PageHeader` / `PageFooter` には props として `page`（`title` など）・`route`・`headings` が渡される。オーバーライドした `.astro` では MDX と違い base が自動で付かないので、リンクは `import.meta.env.BASE_URL` で解決する（`SiteFooter.astro` 参照）。テーマ追従には `--blume-background` / `--blume-border` / `--blume-content-width` などの CSS 変数が使える（`src/theme/entry.ts` に一覧）。

## blume.config.ts の主な設定

```typescript
import { defineConfig } from "blume";
// 2.0 以降、複数ソース・検索プロバイダー・ホスト指定は adapter を import して使う
import { filesystem, githubReleases } from "blume/sources";

export default defineConfig({
  title: "サイト名",
  description: "デフォルト説明文",
  logo: "/logo.svg",
  banner: "お知らせバー",
  content: {
    root: "docs",                 // 単一ソースならこれだけでもよい（zero-config 短縮形）
    sources: [                    // 複数ソースを統合する場合は adapter の配列にする
      filesystem({ root: "docs" }),   // root/include/exclude は adapter 側へ移す
      githubReleases({ owner: "org", repo: "repo", prefix: "changelog" }),
    ],                            // ※ root と sources は併用できない
  },
  github: { owner: "org", repo: "repo", branch: "main" }, // 「Edit this page」等
  theme: { /* アクセントカラー・角丸・フォント */ },
  navigation: { /* サイドバー・タブ */ },
  search: { /* 既定は orama。変える場合は blume/search の adapter を渡す */ },
  reference: [ /* OpenAPI・GraphQL 等は blume/reference の adapter を並べる */ ],
  analytics: [ /* blume/analytics の adapter を並べる */ ],
  ai: { /* assistant（旧 Ask AI）・openInChat */ },
  agents: { /* llms.txt・MCP・catalog などの機械可読な面。1.x の ai.* から移動 */ },
  seo: { /* OG 画像・RSS・サイトマップ */ },
  lastModified: "git",            // false / "git" / "frontmatter" のフラット値
  deployment: {
    site: "https://example.com",  // 絶対 URL（sitemap/OG/RSS に必要）
    base: "/docs",                // サブディレクトリ配信時
  },                              // ホスト指定が要るときは blume/deploy の adapter に置き換える
});
```

## デプロイ

- `blume build` → `dist/` を静的ホスティングへ（Vercel / Netlify / Cloudflare Pages / GitHub Pages / S3 など）
- ビルドコマンド `blume build`、出力ディレクトリ `dist`、Node 22.12+ を指定する
- アシスタント（旧 Ask AI）などの動的機能を使う場合のみ、`blume/deploy` の adapter でホストを名指しする（`deployment: vercel()`。2.0 で `deployment.output` / `deployment.adapter` と `blume build --output/--adapter/--base` は廃止）

## 公式ドキュメントの主要ページ

- Quickstart: https://useblume.dev/docs/quickstart
- Pages: https://useblume.dev/docs/content
- Navigation: https://useblume.dev/docs/content/navigation
- Components: https://useblume.dev/docs/content/components
- Configuration: https://useblume.dev/docs/configuration
- Deployment: https://useblume.dev/docs/deployment
