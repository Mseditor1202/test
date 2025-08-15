import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";
import auth from "../../../utils/auth";

const createItem = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await connectDB();
    const ownerEmail = req.user.email;
    const { title, price, image, description } = req.body;
    if (!title || !price || !image || !description) {
      return res.status(400).json({ message: "すべての項目を入力してください" });
    }

    await ItemModel.create({
      title,
      price,
      image,
      description,
      email,
    });

    return res.status(200).json({ message: "アイテム作成が成功しました" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "アイテム作成が失敗しました" });
  }
};

export default auth(createItem);
