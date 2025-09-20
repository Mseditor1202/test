import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";
import { UserModel } from "../../../utils/schemaModels";
import mongoose from "mongoose";
import { parse as parseCookie } from "cookie";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

function extractEmail(payload) {
  return 
    payload?.email ??
    payload?.user?.email ??
    payload?.data?.email ??
    "";
}
function normEmail(e) {
  return String(e ?? "").trim().toLowerCase();
}

export default async function getSingleItem(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  // 1) 認証（DB接続より先にやって fail fast）
  const cookies = parseCookie(req.headers.cookie || "");
  const cookieToken = cookies.token || "";
  const m = (req.headers.authorization || "").match(/^Bearer\s+(.+)$/i);
  const bearerToken = m ? m[1] : "";
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (!SECRET) {
    return res.status(500).json({ message: "server misconfig: JWT_SECRET missing" });
  }

  let payload;
  try {
    payload = jwt.verify(token, SECRET); 
  } catch {
    return res.status(401).json({ message: "unauthorized" });
  }

  // 2) ID バリデーション
  const { id } = req.query;
  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "invalid id" });
  }

  try {
    await connectDB();

    const item = await ItemModel.findById(id).lean();
    if (!item) {
      return res.status(404).json({ message: "not found" });
    }

    const ownerEmail = normEmail(item.email);
    let viewerEmail = normEmail(extractEmail(payload));
    if (!viewerEmail && (payload?.userId || payload?.id)) {
      const u = await UserModel.findById(payload.userId || payload.id, "email").lean();
      viewerEmail = normEmail(u?.email);
    }

    if (process.env.NODE_ENV !== "production") {
      const mask = (e) => (e ? `${e.slice(0,2)}***@${(e.split("@")[1]||"")}` : "(none)");
      console.log("[auth-debug]", {
        hasCookie: !!req.headers.cookie,
        source: m ? "bearer" : "cookie",
        payloadKeys: Object.keys(payload || {})
      });
      console.log("[owner-check]", { owner: mask(ownerEmail), viewer: mask(viewerEmail) });
    }

    const isOwner = viewerEmail && ownerEmail === viewerEmail;
    if (!isOwner) {
      return res.status(404).json({ message: "not found" });
    }

    // ---- レスポンス（フロントと合わせて { item } で返す）----
    return res.status(200).json({ item });
  } catch (err) {
    console.error("API /item/[id] error:", err);
    return res.status(500).json({ message: "server error" });
  }
}
