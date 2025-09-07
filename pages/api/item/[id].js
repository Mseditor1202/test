import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";
import mongoose from "mongoose";
import { parse as parseCookie } from "cookie";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

console.log();
export default async function getSingleItem(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  try {
    await connectDB();

    // 1) Cookie → token 抽出（named import で parse を使う）
    const cookies = parseCookie(req.headers.cookie || "");
    const token = cookies.token || "";

    // 2) JWT 検証
    let payload;
    try {
      if (!token) throw new Error("no token");
      if (!SECRET) throw new Error("missing secret");
      payload = jwt.verify(token, SECRET); // 例: payload.email を想定
    } catch {
      return res.status(401).json({ message: "unauthorized" });
    }

    // 3) id バリデーション
    const { id } = req.query;
    if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid id" });
    }

    // 4) ドキュメント取得
    const item = await ItemModel.findById(id).lean();
    if (!item) {
      return res.status(404).json({ message: "not found" });
    }

    // 5) 所有者チェック（本人以外には 404 を返す運用）
    if (item.email !== payload.email) {
      return res.status(404).json({ message: "not found" });
      // 区別したいなら 403:
      // return res.status(403).json({ message: "forbidden" });
    }

    // 6) 返却
    return res.status(200).json(item);
  } catch (err) {
    console.error("API /item/[id] error:", err);
    return res.status(500).json({ message: "server error" });
  }
}
