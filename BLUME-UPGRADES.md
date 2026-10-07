# Blume バージョン更新の記録

このサイトが踏んだ Blume の変更を、版ごとに新しい順で記録したもの。**日々の作業では読まなくてよい参考資料**で、現在の運用に効く事実は CLAUDE.md の「現状の注意点」側に置いてある。

読むのは次のようなとき:

- バージョンを上げるとき（過去にどこで何が壊れたか・何を確認したか）
- 検索の挙動やビルド出力に違和感が出たとき（いつ・なぜそうなったか）
- upstream に issue や PR を出すとき（過去のやりとりの経緯）

更新手順の要点は次の2つ。

- **`npx blume@latest upgrade` を使うのが早い**。`package.json` を上げてインストールし、残る設定変更を**ファイル・行番号・置換内容つきで列挙**してくれる。2.0 への更新ではこれが `blume.config.ts` の `lastModified` 1件だけを正しく指した
- 出力を検証するときは `rm -rf .blume dist` してからビルドする（`.blume` がキャッシュを持つため）

---

## 2.1.0 〜 2.2.0

### このサイトが対応したこと

- **`<Changelog />` へ乗り換え、自作の `components/ChangelogIndex.astro` を削除した**（約150行＋`components.ts` の `mdx` 登録が不要になった）。`docs/90-changelog/index.mdx` は導入文と RSS リンクを保ったまま、一覧だけを組み込みタグに任せる形になった。**このタグは upstream に出した [blume#317](https://github.com/haydenbleasel/blume/issues/317)（issue）と [#357](https://github.com/haydenbleasel/blume/pull/357)（PR）の成果**で、2.2.0 で入った
  - 見た目が変わった: 年ごとのグルーピング（`2026年`）が付き、行は「タイトル → カテゴリ → 日付」の並びになった。日付は年がグループ見出しに出るぶん `07/28` と月日だけになる
  - **エージェント向け出力が改善した**。自作版は `.md` ミラー・llms-full.txt・MCP に一覧を出せていなかったが、組み込みタグは serializer を持つので `/changelog.md` にリリース一覧が出る
- **`docs/10-features/meta.ts` の `pages` を修正した**。`"10-money"` のようにディレクトリ名のまま書いていて**一致せず黙って無効化されていた**（実際の並び順はディレクトリ名の数字プレフィックスが担っていたので見た目は正しかった）。2.1.x で入った `BLUME_META_UNKNOWN_PAGE` 診断が検出。**子はスラッグ（数字プレフィックスを外した名前）で書く**
- **Node.js 要件が 22.12 → 22.19 に上がった**（undici 8 の要求）。`.node-version` は 22.23.1 なので手元も CI も影響なし。`blume doctor` が古い Node を警告する

### 確認したが影響が無かったこと

- **コンテンツ変数 `{{name}}`**（2.1.0）。`docs/` に `{{` の使用箇所は無いので衝突しない
- **組み込みサイトフッター**（2.1.0 の `footer` 設定）。`RootLayout` は `resolveSlot(layout.Footer, SiteFooter)` の形で、**`components.ts` の `layout.Footer` が組み込みを上書きする**。免責フッターはそのまま残る
- ヘッダーが**アイコンボタン化**した（検索窓 → 虫眼鏡アイコン、ホバーでツールチップ）。見た目の変化のみ
- 検索（日本語・bigram）、免責フッター65/65、OG 65枚、sitemap の lastmod 65件、太字パース漏れ0件はいずれも維持

### 既知の警告（このサイト固有・未対応）

`npx blume validate` が `docs/index.mdx` の base 直書きリンクについて `BLUME_BROKEN_ASSET` を3件出すようになった（`/legal-check-helper/llms.txt` など）。2.2.0 で validate がアセット解決を厳しくしたため。**生成物であって `public/` のファイルではない**ので検出自体が的外れだが、リンクを base 抜きで書けば消える可能性がある（未検証）。従来からの `index.md` の `BLUME_BROKEN_LINK` 1件（既知の誤検知）とあわせて、いまは警告として許容している

---

## 2.0.0 〜 2.0.3

### 破壊的変更の本体は「adapter 化」

検索・デプロイ・コンテンツソース・API リファレンス・アナリティクス・アシスタントの設定が、`blume/*` サブパスから import する関数呼び出しに変わった。ただし**このサイトは該当機能をほぼ使っていないため、実際に必要だった変更は `lastModified` の1行だけ**だった。

「使っていないので素通りした」もの:

- `analytics` オブジェクト → `blume/analytics` の adapter 配列
- `ai.ask` → `blume/ai` の adapter（2.0.1 でさらに `ai.assistant` に改名）
- `openapi` / `asyncapi` / `graphql` → `blume/reference` の adapter を並べる `reference` 配列
- `redirects` のワイルドカード・`:param` 禁止（ホスト側の設定に寄せる方針）
- `search.boost` frontmatter の削除（もともと読まれていなかった）
- `theme.layout` の削除、`markdown.codeBlocks` → `markdown.code` への統合
- `ai.*` の機械可読な面（`llmsTxt` / `mcp` / `catalog` など）が新設の `agents.*` へ移動

**素の形が残っている設定**（adapter にしなくてよい）:

- `deployment: { site, base }` は静的ビルド用としてそのまま有効
- `search: { popular }` も有効（既定の orama のまま）
- `content: { root: "docs" }` も zero-config 短縮形として有効。ただし `content.root` と `content.sources` は併用できない

### 個別の変更

- `lastModified` は**真偽値・オブジェクト形式が廃止**され、`false` / `"git"` / `"frontmatter"` のフラット値のみになった。1.x の `true` が `"git"` に相当する（このサイトが踏んだ唯一の要対応）
- `components.ts` は**静的に解決される**ようになり、実行時フォールバックが消えた。`mdx` / `layout` の各エントリは import 済み識別子・パス文字列・`{ component, client, media }` のいずれかである必要がある。**このサイトはパス文字列なのでセーフ**。インライン関数やスプレッドを書くと `BLUME_COMPONENTS_INVALID` で落ちる。`islands` グループは廃止され、`mdx` に `client` を指定する形に統合された
- 各コマンドが**知らないフラグを黙って無視せずエラーにする**ようになった（`--isolatd` のような打ち間違いが提案付きで落ちる）。`blume build --output/--adapter/--base` は廃止
- **OG カードの副題がページ自身の description に変わった**。日本語の描画は正常。また既定のカードフォントスタックに各 script の Noto フォールバックが入り、`seo.og.fonts` の明示指定が不要になった（対応は下の「2.0 後の棚卸し」）
- 出力が増えた: JSON docs API（`/api/docs/*`、1ページ1 JSON）、`openapi.json`、`.well-known/{ai-catalog.json,ard.json,api-catalog}`、`404.json` / `404.md`、`vercel.json`（GitHub Pages では無視されるだけ）

### 更新時に確認したこと（1.6.0 → 2.0.3）

- **検索の挙動は変わっていない**。1.6.0 と 2.0.3 で `dist/blume-search.json` の65ページ分の内容が完全一致した。bigram 索引（#132）も語内句読点の分割（#178）もそのまま
- `docs/index.mdx` に base 直書きしている4本のリンク（`/legal-check-helper/llms.txt` など）が**二重連結しないこと**。2.0 は「ページのルートが base と同じセグメントで始まっていても base を前置する」方針に変わったため懸念したが、出力は 1.6.0 と同一だった
- 免責フッターが実ページ65件すべてに出ること、太字のパース漏れが0件であること、sitemap の `lastmod` が65件出ること

### 2.0 後の棚卸し

- **`navigation.tabs` の `href: "/changelog"` を外した**（対応済み）。2.0 で「`/changelog` タブは `href` 無しでも一覧を開く」ように直り、回避策の役目が終わったため
- **`seo.og.fonts` の Noto Sans JP 指定を外した**（対応済み）。2.0 で既定のカードフォントスタックに各 script の Noto フォールバックが入ったため。外す前後の OG カードを目視で比較し、字形・ウェイトとも差がないこと、半濁点・全角括弧・中黒・長音が正常に出ることを確認済み。ビルド時の Google Fonts 取得がなくなる副次効果もある
- **自前の `components/ChangelogIndex.astro`**（当時は見送り → **2.2.0 で解決済み。上の「2.1.0 〜 2.2.0」を参照**）。以下は当時の判断の記録:
  - upstream の `/changelog` 索引が「年ごとにタイトル・カテゴリ・日付の1行」を出す形になり見た目は近いが、標準版に寄せると次を失う:
    - `docs/90-changelog/index.mdx` の導入文と、そこに置いてある**可視の RSS リンク**（標準版は `<link rel="alternate">` だけになる）
  - `/changelog` 一覧ページの左サイドバー（エントリ一覧）。※各エントリのページ側にはサイドバーが出るので、影響は一覧ページだけ
  - 標準版の既定文言は「変更履歴 / 製品のアップデートとリリースノート。」で、`i18n.ui.ja.changelog.{title,description}` で上書きできる（ロケールをキーにした `Record` なので `ui: { ja: { … } }` と書く）
  - 判断: 失うのは読者に見える要素、得るのは保守側の行数。1.6.0 → 2.0.3 の major 更新を無改修で通った実績があるため、当面は残す
  - **upstream に [blume#317](https://github.com/haydenbleasel/blume/issues/317) を出した**（2026-09-30）。「生成一覧を組み込み MDX タグとして公開し、著者が導入文を足せるようにする」提案。通れば導入文と RSS リンクを保ったまま `ChangelogIndex.astro` を捨てられるので、**動きがあったらこの判断を見直す**
  - 自作コンポーネントの既知の穴が2つある（#317 に書いた内容）。どちらも今は実害なし:
    - **`staged` コレクションを読んでいない**。`getCollection("docs")` しか見ていないので、将来 `githubReleases()` ソースを足すと、そのエントリだけ一覧から黙って消える。`staged` はユーザー向けドキュメントに記載が無く、生成ページのコードを読まないと気づけない
    - `withBase` を `blume/components/islands/base-path.ts` から import している。`exports` の `./components/*` ワイルドカード経由で届くが未文書
  - なお日付処理は内部 import に頼る必要がない。`data.config.dateFormat` はスキーマ既定値で必ず入っているので、`{ timeZone: "UTC", ...data.config.dateFormat }` が `resolveDateFormatOptions` と等価。いまの `blume/core/date-format.ts` の import は外せる

---

## 1.7.x

- **Mermaid と EPUB が「使うサイトだけバンドル」に変わり、出力が激減した**（`dist` 13M → 8.2M、`_astro` 137 → 40 ファイル）。このサイトは図を使っていないので丸ごと削れた
- **折りたたみサイドバーが遅延読み込みになった**。開いていないセクションの行は各ページの HTML に載らず、初回展開時に `blume-nav/current/default/g0`〜`g9` のプリレンダ断片を取りに行く。**静的ビルドでも `base` 配下でも動く**ことを実機で確認済み
- OG カードがビルド間でキャッシュされるようになった（`node_modules/.cache/blume/og`）
- ページのプリレンダが並列化され、サイドバーの1ページあたりの HTML コストが削られた

## 1.6.x

- **1.6.6 で Astro の `trailingSlash: "never"` が設定された**。スラッシュ無しがページの唯一の住所という扱いで、内部リンク・sitemap・canonical は全てスラッシュ無しに揃っている（副作用は CLAUDE.md 側に記載）
- **1.6.0 で `.mdx` が索引時に MDX としてパースされるようになった**（blume#dd1ed31）。効果が2つあり、どちらもこのサイトには得だった:
  - 各ページ末尾の `{/* 実務メモ: ... */}` が索引から消えた。1.5.3 までは全ページの本文にこの文字列が入っていて、「実務」「書籍」あたりで検索すると全ページがヒットしていた
  - `<Card>` / `<CardGroup>` が Markdown に降ろされ、**カードのタイトルが索引に入るようになった**（トップページの「機能から引く」「商材から引く」など）。同じ降ろし方が `.md` ミラー・llms-full.txt・Ask AI のグラウンディングにも効く
  - なお `search.indexing.includeCodeBlocks` でコードフェンスも索引に入れられるが、既定の plain text のままにしている
- **1.6.0 で見出しのマーカー記法が常時 ON になった**（blume#2fa67b8 / #35b5c6a）。`## 見出し [#custom-id]` でアンカー固定、`[!toc]` で目次から外す、`[toc]` で目次だけに出す、`.md` では `{#id}`（`.mdx` では `\{#id\}`）。**副作用として、見出しの末尾がマーカーの形をした角かっこで終わっているとマーカーとして食われる**（執筆ルールは CLAUDE.md 側に記載）
- 1.6.0 で「チャットで開く」のプロンプトが UI 辞書（`actions.openInChatPrompt`）から来るようになり、**日本語になった**（それまで英語ハードコード）。あわせて 1.5.2 のクライアントルーター由来の不具合が2つ直っている: 遷移中に `data-theme` が落ちてダークが一瞬ライトになる件、画像ライトボックスが初回遷移後に閉じられなくなる件
- 1.6.0 の目玉（GraphQL リファレンス、Obsidian vault ソース、`<include>` によるコンテンツ分割、`navigation.actions` / `navigation.cta`、`github.host`）はこのサイトでは未使用。`<include>` は共通の注意書きを部分ファイル化したくなったときの選択肢（`_` 始まりのファイルはもともとルーティング対象外）

## 1.5.x

- **ページ遷移は 1.5.2 で Astro の client router（`<ClientRouter />`）に置き換わった**（commit `e2dbf74`。PR を経ない直コミット）。1.5.1 が入れていたクロスドキュメントの `@view-transition` CSS ルールは削除され、同一オリジンのリンククリックは**ドキュメントを捨てずに中身を差し替える**方式になった。ネイティブ View Transitions が使える環境ではそれで、それ以外は Astro のフェードにフォールバックし、どちらも `prefers-reduced-motion` を尊重する。副作用として**サイドバーのスクロール位置がページ間で維持される**、検索結果の遷移もルーター経由になる。1.5.3 は**この差し替え時に CSS 未適用のフレームが1〜2枚描かれる問題の修正**（MDX 本文のように head ストリーム後に描画されるコンポーネントの CSS は body に hoist されるが、client router はそれを preload も persist もしていなかった）。実質 1.5.2 と 1.5.3 はセットなので、**1.5.2 だけで止めない**
- 1.5.2 で**セグメント分割の対象が、こちらが積み上げてきた `ja`/`zh`/`ko`/`th` の言語リストから「Latin 以外の script 全部」に一般化された**（[blume#194](https://github.com/haydenbleasel/blume/pull/194)、kotuke 氏）。言語を列挙する代わりに `Intl.Locale.maximize()` の script で判定する形になり、キリル・ギリシャ・ヘブライ・デーヴァナーガリーが救われた（`sr-Latn` は Orama 既定のまま、`az-Cyrl` はセグメント、と script が実態に一致する）。**この PR は #125 を「ロシア語も日本語と同じ壊れ方をする」という形で出発点に引き、#132・#178 の CJK 挙動には触らないと明示している**ので、bigram 索引もクエリ側の strict→OR フォールバックもこちらが入れたまま残っている。あわせて**セグメント索引上の Latin 語はダイアクリティカルマークを畳む**ようになった（café ↔ cafe）
- 1.5.1 で**既定の display フォントが Inter Tight → Inter に変わった**（body と同じ family になり、見出しのトラッキングはテーマ側の `letter-spacing: -0.05em` で出す）。あわせて preload が「above-the-fold で実際に使うウェイトだけ」に絞られ、このサイトでは preload される woff2 が 2 ファイルになった。`theme.fonts` を設定していないので既定に追随している＝**見出しの見た目がわずかに変わる**。Inter Tight に戻すなら slug `inter-tight` を指定する
- 1.5.1 で**全リンクの prefetch（hover / viewport）が既定で入った**。オプトアウトの設定は用意されていないので、挙動を変えたいなら upstream に相談する。同じリリースの trailing-slash 308 リダイレクトは Vercel 限定、shallow clone 警告（`BLUME_SHALLOW_GIT_HISTORY`）は `deploy.yml` で `fetch-depth: 0` 済みなので、どちらもこのサイトには効かない
- 1.5.0（[blume#187](https://github.com/haydenbleasel/blume/pull/187)、こちらから出した PR）で、**`blume audit` の title / description 長が文字数でなく表示桁数（`string-width`）基準になった**。全角は 2 列。日本語サイトが一律 `BLUME_AUDIT_DESCRIPTION_LENGTH` を出す問題は消えた
- 1.5.0（[blume#183](https://github.com/haydenbleasel/blume/pull/183)）で、**サイドバーの表示モードをグループ単位で指定できるようになった**（フォルダの `meta.ts` の `display`、または index ページ frontmatter の `sidebar.display`）
- 1.5.2 にはこのサイトで使っていない機能の追加も多い（OpenAPI / AsyncAPI の Try It プレイグラウンド、`ai.ask.retrieval` の3ノブ、`ai.openInChat` のプロバイダ選択、Ask AI パネルの遷移越え永続化）。**ダークモード favicon** は `icon.svg` の隣に `icon-dark.svg` を置くだけで自動検出される — 将来アイコンを差し替えるときの選択肢

## 1.4.3 — 語の内側の句読点（[blume#178](https://github.com/haydenbleasel/blume/pull/178)、こちらから出した PR）

**語の内側に残る句読点が索引語から外れた。** `Intl.Segmenter` は UAX #29 に従って接続用句読点・書式文字を語の内側に保持するので、`スネーク_ケース` や `robots.txt` が丸ごと1トークンになり、句読点を打ち直さないと引けなかった。索引前の NFC 正規化もこのときに入った。

- **教訓**: 自分が最初に出した版は「文字でも数字でもないもの」で分割していて、**タイの母音・声調記号（`\p{M}`）まで落として語を壊していた**（`เปลี่ยน` → `เปล` / `ยน`）。索引側もクエリ側も同じ壊れ方をするので既存テストは通ってしまう。作者が追加コミットで `\p{M}` を語の一部に含める形に直してからマージされた。**`\p{L}\p{N}` だけで「語」を定義すると結合文字を使う文字体系が壊れる**

## 1.3.0 — CJK の複合語ランキング（[blume#132](https://github.com/haydenbleasel/blume/pull/132)、こちらから出した PR）

日本語・中国語の索引が**漢字・かな・カナの連なりを文字 bigram に切って**張られるようになった。辞書分割だけだと語の隣接情報が失われ、各法令を浅く言及するトップページが1位に来ていた。クエリ側は**全 bigram を含むページを優先し、0件なら OR に落とす**。

## 1.2.x — 日本語検索が通るまで

1.2.0 までは orama のトークナイザが english 固定で日本語がヒット0件になるため pagefind に逃していた。1.2.1（[blume#125](https://github.com/haydenbleasel/blume/issues/125)）で分かち書きが入り、続く 1.3.0 でランキングが直ったため既定に戻した。`scripts/reindex-search.mjs` と pagefind の devDependency は削除済み。

なお MCP の `search_docs` と Ask AI のグラウンディングも同じ `buildOramaIndex` を使うので、**検索ダイアログだけでなくそちらの日本語検索も同時に直っている**（pagefind への迂回ではダイアログしか直っていなかった）。

## 1.1.0 以前 — patch-package の全廃

1.0.4 時代に当てていた2つのパッチは、どちらも upstream に取り込まれて不要になった。

- **OG 画像の日本語豆腐対策** → `seo.og.fonts` で対応（[blume#62](https://github.com/haydenbleasel/blume/issues/62) の解決）
- **日付表示の `yyyy/mm/dd` パッチ** → 廃止。1.1.0 で changelog タイムラインもロケール準拠になった

あわせて、機能ページを移動したときの `redirects` は 1.1.0 以降 `to` に `deployment.base` が自動で付くため base を書かない（[blume#71](https://github.com/haydenbleasel/blume/pull/71)）。ヘッダータブの `href` 明示は 1.2.0 の [blume#122](https://github.com/haydenbleasel/blume/pull/122) による。
