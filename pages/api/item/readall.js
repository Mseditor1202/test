import connectDB from "../../../utils/database"
import { ItemModel } from "../../../utils/schemaModels"

export default async function getAllItems(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }
  try {
    console.log("[readall] MONGODB_URI set?", !!process.env.MONGODB_URI)
    console.log("[readall] DB_NAME:", process.env.DB_NAME)

    await connectDB()
    const allItems = await ItemModel.find().sort({ createdAt: -1 }).lean()

    return res.status(200).json({
      message: "アイテム読み取り成功（オール）",
      allItems,
    })
  } catch (err) {
    console.error("[readall] error:", err) // ← ここに生の原因が出る
    return res.status(500).json({
      message: "アイテム読み取り失敗（オール）",
      error: String(err?.message || err),
    })
  }
}
