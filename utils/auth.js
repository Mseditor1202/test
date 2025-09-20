// utils/auth.js
import { parse as parseCookie } from "cookie";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

// 小物
export const normEmail = (e) => String(e ?? "").trim().toLowerCase();
export const extractEmail = (p) => p?.email ?? p?.user?.email ?? p?.data?.email ?? "";

// Authorization: Bearer か Cookie の token/jwt を拾う（"undefined"/"null"無効化）
export function getToken(req) {
  const auth = (req.headers.authorization || "").trim();
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const bearer = m ? m[1].trim() : "";
  const cookies = parseCookie(req.headers.cookie || "");
  const cookieToken = (cookies.token || cookies.jwt || "").trim();
  const v = bearer || cookieToken;
  return v && v !== "undefined" && v !== "null" ? v : "";
}

// 成功: payload を返す / 失敗: その場でレス送信して null
export function verifyToken(req, res) {
  const token = getToken(req);
  if (!token) {
    res.setHeader("WWW-Authenticate", 'Bearer realm="api", error="no_token"');
    res.status(401).json({ message: "トークンがありません" });
    return null;
  }
  if (!SECRET) {
    res.status(500).json({ message: "サーバー設定エラー: JWT_SECRET 未設定" });
    return null;
  }
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    res.setHeader("WWW-Authenticate", 'Bearer error="invalid_token"');
    res.status(401).json({ message: "トークンが無効です" });
    return null;
  }
}

// ★API Route専用（Reactページには使わない）
const requireAuth = (handler) => {
  return async (req, res) => {
    try {
      const payload = verifyToken(req, res);
      if (!payload) return; // ここでレス済み

      req.user = {
        email: normEmail(extractEmail(payload)),
        id: payload.userId || payload.id || null,
        raw: payload,
      };

      return await handler(req, res); // 未応答/二重送信防止
    } catch (e) {
      console.error("[requireAuth] error:", e);
      if (!res.headersSent) {
        return res.status(500).json({ message: "auth middleware error" });
      }
    }
  };
};

export default requireAuth;

export const optionalAuth = (handler) => {
  return async (req, res) => {
    try {
      let payload = null;
      const token = getToken(req);
      if (token && SECRET) {
        try { payload = jwt.verify(token, SECRET); } catch {}
      }
      req.user = payload
        ? { email: normEmail(extractEmail(payload)), id: payload.userId || payload.id || null, raw: payload }
        : null;
      return await handler(req, res);
    } catch (e) {
      console.error("[optionalAuth] error:", e);
      if (!res.headersSent) {
        return res.status(500).json({ message: "auth middleware error" });
      }
    }
  };
};
