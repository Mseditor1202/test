import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";

export default async function getSingleItem(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  try {
    await connectDB();
    const { id } = req.query;

    const item = await ItemModel.findById(id).lean(); // プレーンオブジェクトで取得
    if (!item) {
      return res.status(404).json({ message: "not found" });
    }

    // ← ここがポイント：メッセージで包まずドキュメントをそのまま返す
    return res.status(200).json(item);
  } catch (err) {
    // 不正なIDなど
    return res.status(400).json({ message: "invalid id" });
  }
}