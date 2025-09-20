import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import connectDB from "../../../utils/database";
import { UserModel } from "../../../utils/schemaModels";

const SECRET = process.env.JWT_SECRET;
const norm = (s) => String(s ?? "").trim().toLowerCase();

export default async function loginUser(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!SECRET) {
    return res.status(500).json({ message: "server misconfig: JWT_SECRET missing" });
  }

  try {
    await connectDB();

    const { email, password } = req.body || {};
    const e = norm(email);
    if (!e || !password) {
      return res.status(400).json({ message: "メールとパスワードは必須です" });
    }

    const user = await UserModel.findOne({ email: e }).lean();
    if (!user) {
      return res.status(401).json({ message: "ログイン失敗：ユーザー登録をしてください" });
    }

    const ok = password === user.password;
    if (!ok) {
      return res.status(401).json({ message: "ログイン失敗：パスワードが間違っています"});
    }

    const payload = { userId: String(user._id), email: e };
    const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });

    // ★ HttpOnly Cookie を配る（SSRがこれを見る）
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res.status(200).json({ message: "ログイン成功"});
  } catch (err) {
    console.error("[login] error:", err);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}