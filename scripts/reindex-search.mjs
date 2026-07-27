// 検索インデックスを本文（<article>）だけで作り直す。npm run build から呼ばれる。
//
// blume は pagefind を rootSelector 未指定（= ページ全体）で走らせる。本来は本文に
// data-pagefind-body を付けて絞り込む設計で、search/build.ts のコメントもそう書いて
// あるのだが、その属性はどこにも出力されていない。結果、ヘッダー・目次・共有メニュー・
// 「コンテンツにスキップ」・検索ダイアログ自身の UI 文言まで全ページ分が索引され、
// 検索結果の抜粋が「にスキップ ⌘K Esc ↑↓navigate……」で始まってしまう。
//
// blume 側のスロットを個別に data-pagefind-ignore で包む方法もあるが、スキップリンクや
// ページ操作メニューは差し替えできず取りこぼす。ここでは blume が出したインデックスを
// 捨てて、本文だけを対象に張り直す。クライアント側（pagefind.js の読み込み）は blume の
// 生成物をそのまま使うので、search.provider は pagefind のままでよい。
//
// upstream が data-pagefind-body を出すようになったら、このスクリプトごと不要になる。
import { rm } from "node:fs/promises";
import * as pagefind from "pagefind";

const OUT_DIR = "dist";
const INDEX_DIR = `${OUT_DIR}/pagefind`;

// 作り直す前に消す。ファイル名にコンテンツハッシュが入るので、上書きだけだと
// 古い索引の破片が dist に残る
await rm(INDEX_DIR, { recursive: true, force: true });

const { index } = await pagefind.createIndex({ rootSelector: "article" });
if (!index) {
  throw new Error("pagefind インデックスの作成に失敗しました");
}

const { page_count } = await index.addDirectory({ path: OUT_DIR });
await index.writeFiles({ outputPath: INDEX_DIR });
await pagefind.close();

// page_count は走査したページ数。<article> を持たない 404 は索引に載らないので、
// 実際に検索対象になるのはこれより 1 少ない
console.log(`[search] 本文のみで再インデックスしました: ${page_count} ページを走査`);
