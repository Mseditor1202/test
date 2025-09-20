// pages/api/item/update/[id].js
import requireAuth, { normEmail } from "../../../../utils/auth";
import connectDB from "../../../../utils/database";
import { ItemModel } from "../../../../utils/schemaModels";
import mongoose from "mongoose";

export default requireAuth(async function updateItem(req, res) {
  if (!["PUT", "POST", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", ["PUT", "POST", "PATCH"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "invalid id" });
  }

  // 入力（ItemSchema: price は String）
  const { title, price, image, description } = req.body || {};
  const updates = {};
  if (title !== undefined) updates.title = String(title);
  if (price !== undefined) updates.price = String(price);
  if (image !== undefined) updates.image = String(image);
  if (description !== undefined) updates.description = String(description);
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "no fields to update" });
  }

  try {
    await connectDB();
    const viewerEmail = normEmail(req.user?.email);

    // ★スキーマに合わせて email を使用（owner ではない）
    const updated = await ItemModel.findOneAndUpdate(
      { _id: id, email: viewerEmail },
      { $set: updates, $currentDate: { updatedAt: true } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "not found" });
    }

    return res.status(200).json({ message: "更新しました", item: updated });
  } catch (err) {
    console.error("API /item/update/[id] error:", err);
    if (err?.name === "ValidationError") {
      return res.status(422).json({ message: "validation error", details: err.errors });
    }
    return res.status(500).json({ message: "server error" });
  }
});
