import { defineMeta } from "blume";

export default defineMeta({
  title: "機能から引く",
  icon: "zap",
  // 子はスラッグで並べる（ファイル・フォルダ名から数字プレフィックスを外したもの）。
  // ディレクトリ名のまま書くと一致せず、この指定が黙って無効になる（BLUME_META_UNKNOWN_PAGE）
  pages: ["index", "money", "privacy", "people", "content", "accounting", "assets"],
});
