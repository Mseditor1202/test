// pages/api/item/create.js
import requireAuth, { normEmail } from "../../../utils/auth";
import connectDB from "../../../utils/database";
import { ItemModel } from "../../../utils/schemaModels";

export default requireAuth(async function createItem(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "method not allowed" });
  }

  const { title, price, image, description } = req.body || {};
  if (!title || !price || !image || !description) {
    return res.status(400).json({ message: "すべての項目を入力してください" });
  }

  try {
    await connectDB();

    const viewerEmail = normEmail(req.user?.email); // ★ JWTから所有者メールを取得
    if (!viewerEmail) {
      return res.status(401).json({ message: "未ログインです" });
    }

    const doc = await ItemModel.create({
      title: String(title),
      // スキーマが String なので price も文字列でOK
      price: String(price),
      image: String(image),
      description: String(description),
      email: viewerEmail, // ★ ここを必ず保存（以前は未定義の email を使っていた）
    });

    // 作成したドキュメントを返す（201 Created）
    return res.status(201).json({ message: "アイテム作成が成功しました", item: doc });
  } catch (err) {
    console.error("API /item/create error:", err);
    return res.status(500).json({ message: "アイテム作成が失敗しました" });
  }
});
