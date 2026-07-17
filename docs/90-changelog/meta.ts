import { defineMeta } from "blume";

// エントリの並び順は Blume が date の新しい順に自動で揃えるため、pages は指定しない。
// タイムライン（/changelog）は type: changelog のエントリから自動生成される。
// このフォルダに index.mdx を置くと自動生成が止まるので置かないこと。
export default defineMeta({
  title: "更新履歴",
  icon: "history",
});
