# Blume 使い方まとめ

[Blume](https://useblume.dev/) は Astro + Vite ベースの Markdown ファーストな静的サイトジェネレーター。
「Fast, AI-ready, zero-config」がコンセプトで、`docs/` に Markdown を置くだけでナビゲーション・検索・テーマ込みのドキュメントサイトが立ち上がる。

- 必要要件: **Node.js 22.12 以上**
- このプロジェクトでの導入済みバージョン: `blume ^1.0.3`（`package.json` 参照）

## CLI コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` (`blume dev`) | ホットリロード付き開発サーバーを起動 |
| `npm run build` (`blume build`) | 静的 HTML と検索インデックスを `dist/` に出力 |
| `npm run doctor` (`blume doctor`) | 設定・コンテンツの診断 |

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

## blume.config.ts の主な設定

```typescript
import { defineConfig } from "blume";

export default defineConfig({
  title: "サイト名",
  description: "デフォルト説明文",
  logo: "/logo.svg",
  banner: "お知らせバー",
  content: {
    root: "docs",                 // 単一ソースならこれだけでもよい
    sources: [                    // 複数ソースの統合も可能
      { type: "filesystem", root: "docs" },
      { type: "github-releases", owner: "org", repo: "repo", prefix: "changelog" },
    ],
  },
  github: { owner: "org", repo: "repo", branch: "main" }, // 「Edit this page」等
  theme: { /* アクセントカラー・角丸・フォント */ },
  navigation: { /* サイドバー・タブ */ },
  search: { /* 検索プロバイダー */ },
  ai: { /* llms.txt・Ask AI */ },
  seo: { /* OG 画像・RSS・サイトマップ */ },
  deployment: {
    site: "https://example.com",  // 絶対 URL（sitemap/OG/RSS に必要）
    base: "/docs",                // サブディレクトリ配信時
  },
});
```

## デプロイ

- `blume build` → `dist/` を静的ホスティングへ（Vercel / Netlify / Cloudflare Pages / GitHub Pages / S3 など）
- ビルドコマンド `blume build`、出力ディレクトリ `dist`、Node 22.12+ を指定する
- Ask AI などの動的機能を使う場合のみ `deployment: { output: "server", adapter: "vercel" }`

## 公式ドキュメントの主要ページ

- Quickstart: https://useblume.dev/docs/quickstart
- Pages: https://useblume.dev/docs/content
- Navigation: https://useblume.dev/docs/content/navigation
- Components: https://useblume.dev/docs/content/components
- Configuration: https://useblume.dev/docs/configuration
- Deployment: https://useblume.dev/docs/deployment
