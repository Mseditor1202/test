import connectDB from "../../../../utils/database";
import { ItemModel } from "../../../../utils/schemaModels";
import auth from "../../../../utils/auth";

const updateItem = async (req, res) => {
  if (req.method !== "PUT") {
    res.setHeader("Allow",["PUT"]);
    return res.status(405).end();
  }

  try {
    await connectDB();
    const { id } = req.query;
    const item = await ItemModel.findById(id);
    if (!item) {
      return res.status(404).json({ message: "not found" });
    }

   const ownerEmail = req.user?.email;
   if (!ownerEmail || item.email !== ownerEmail) {
    return res.status(403).json({ message: "あなたのアイテムではありません"})
   }

   const { title, price, image, description } = req.body || {};
   const updates = {};
   if (title !== undefined) updates.title = title;
   if (price !== undefined) updates.price = price;
   if (image !== undefined) updates.image = image;
   if (description !== undefined) updates.description = description;

   if (Object.keys(updates).length === 0) {
    return res.status(200).json(item.toObject());
   }

    Object.assign(item, updates);
    const saved = await item.save();

    return res.status(200).json(saved);
  } catch (err) {
    return res.status(400).json({ message: "アイテム編集失敗"});
  }
}

export default auth(updateItem);

