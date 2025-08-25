import jwt from "jsonwebtoken";
import connectDB from "../../../utils/database";
import { UserModel } from "../../../utils/schemaModels";

const secret = process.env.JWT_SECRET || "dev_secret";

export default async function loginUser(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "メールとパスワードは必須です" });
    }

    const savedUserData = await UserModel.findOne({ email });
    if (!savedUserData) {
      return res.status(401).json({ message: "ログイン失敗：ユーザー登録をしてください" });
    }

    // ★ いまはプレーン比較（登録時に平文で保存している想定）
    const isMatch = password === savedUserData.password;
    if (!isMatch) {
      return res.status(401).json({ message: "ログイン失敗：パスワードが間違っています" });
    }

    const payload = { id: savedUserData._id, email: savedUserData.email };
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    return res.status(200).json({ message: "ログイン成功", token });
  } catch (err) {
    console.error("[login] error:", err);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}