import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";
import mongoose from "mongoose";

export default async function getSingleItem(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  try {
    await connectDB();
    const { id } = req.query;

    console.log("API hit /api/item/[id]", { method: req.method, id });

   if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
     return res.status(400).json({ message: "invalid id" });
   }

    const item = await ItemModel.findById(id).lean(); // プレーンオブジェクトで取得
    if (!item) return res.status(404).json({ message: "not found" });

    // ← ここがポイント：メッセージで包まずドキュメントをそのまま返す
    return res.status(200).json(item);
  } catch (err) {
    // 不正なIDなど
    console.error("API /item/[id] error:", err);
    return res.status(500).json({ message: "server error" });
  }
}