// pages/api/item/[id].js
import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";
import mongoose from "mongoose";
import { parse as parseCookie } from "cookie";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default async function getSingleItem(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  // 1) 認証（DB接続より先にやって fail fast）
  const cookies = parseCookie(req.headers.cookie || "");
  const token = cookies.token || "";

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (!SECRET) {
    // サーバの設定漏れは 500
    return res.status(500).json({ message: "server misconfig: JWT_SECRET missing" });
  }

  let payload;
  try {
    payload = jwt.verify(token, SECRET); // 例: payload.email 使用
  } catch {
    return res.status(401).json({ message: "unauthorized" });
  }

  // 2) ID バリデーション
  const { id } = req.query;
  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "invalid id" });
  }

  try {
    // 3) DB 接続
    await connectDB();

    // 4) ドキュメント取得
    const item = await ItemModel.findById(id).lean();
    if (!item) {
      return res.status(404).json({ message: "not found" });
    }

    // 5) 所有者チェック
    if (item.email !== payload.email) {
      // 区別したくない運用なら 404、区別したいなら 403 に変更
      return res.status(404).json({ message: "not found" });
      // return res.status(403).json({ message: "forbidden" });
    }

    // 6) レスポンス形は一貫させる（フロントと合わせて）
    return res.status(200).json({ item });
  } catch (err) {
    console.error("API /item/[id] error:", err);
    return res.status(500).json({ message: "server error" });
  }
}
