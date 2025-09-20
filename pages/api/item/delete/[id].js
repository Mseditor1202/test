// pages/api/item/delete/[id].js
import requireAuth, { normEmail } from "../../../../utils/auth";
import connectDB from "../../../../utils/database";
import { ItemModel } from "../../../../utils/schemaModels";
import mongoose from "mongoose";

export default requireAuth(async function deleteItem(req, res) {
  if (!["DELETE", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["DELETE", "POST"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "invalid id" });
  }

  try {
    await connectDB();
    const viewerEmail = normEmail(req.user?.email);

    // 本人のアイテムだけ原子的に削除
    const deleted = await ItemModel.findOneAndDelete({
      _id: id,
      email: viewerEmail,
    }).lean();

    if (!deleted) {
      return res.status(404).json({ message: "not found" });
    }

    return res.status(200).json({ message: "削除しました", item: deleted });
  } catch (e) {
    console.error("API /item/delete/[id] error:", e);
    return res.status(500).json({ message: "server error" });
  }
});
