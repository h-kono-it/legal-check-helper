import { defineMeta } from "blume";

// /changelog は index.mdx（+ components/ChangelogIndex.astro）が持つタイトル一覧。
// index.mdx を置いた時点で Blume 標準の全文タイムラインは生成されなくなる（意図的）。
// エントリの並び順は ChangelogIndex 側で date の新しい順に揃えるため、pages は指定しない。
export default defineMeta({
  title: "更新履歴",
  icon: "history",
});
