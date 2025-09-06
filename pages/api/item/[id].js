import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";
import mongoose from "mongoose";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default async function getSingleItem(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  try {
    await connectDB();

    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token || "";
    let payload;
    try {
      if (!token) throw new Error("no token");
      payload = jwt.verify(token, SECRET);
    } catch {
      return res.status(401).json({ message: "unauthorized" });
    }
    
    const { id } = req.query;
      if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "invalid id" });
      }
      
      if (item.email !== payload.email) {
        return res.status(404).json({ message: "not found" });
      }

    return res.status(200).json(item);
   } catch (err) {
    console.error("API /item/[id] error:", err);
    return res.status(500).json({ message: "server error" });
   }
}