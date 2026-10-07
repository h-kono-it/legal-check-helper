import { defineMeta } from "blume";

// /changelog は index.mdx が持つ。導入文と RSS リンクを書いた下に、Blume 組み込みの
// <Changelog /> でリリース一覧を出す（blume 2.2.0 で入ったタグ。upstream に出した
// blume#317 / #357 の成果で、これにより自作の ChangelogIndex.astro は不要になった）。
// index.mdx がルートを取るので Blume 側の自動生成ページは出ない。
// 並び順は <Changelog /> が date の新しい順に揃えるため、pages は指定しない。
export default defineMeta({
  title: "更新履歴",
  icon: "history",
});
