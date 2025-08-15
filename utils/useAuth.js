import { useEffect, useState } from "react";
import { useRouter } from "next/router";


export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);      // 未ログインは null
  const [loading, setLoading] = useState(true); // 判定中は true

  useEffect(() => {
    let cancelled = false;
    const onLoginPage = router.pathname === "/user/login";

    // useEffect 内なら window チェック不要
    const token = localStorage.getItem("token");

    if (!token) {
      if (!cancelled) {
        setUser(null);
        setLoading(false);
      }
      if (!onLoginPage) router.replace("/user/login");
      return;
    }

    try {
      // 署名検証はサーバ側で行う。ここでは exp だけ見る（decode）
      const [, payloadB64] = token.split(".");
      const payload = JSON.parse(atob(payloadB64 || ""));
      const expired =
        typeof payload?.exp === "number"
          ? payload.exp * 1000 < Date.now()
          : false;
      if (expired) throw new Error("expired");

      if (!cancelled) setUser(payload); // 必要なら { email: payload.email } に整形
    } catch (e) {
      localStorage.removeItem("token");
      if (!cancelled) setUser(null);
      if (!onLoginPage) router.replace("/user/login");
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true; // アンマウント後の setState 防止
    };
  }, [router.pathname]);

  // いつでも同じ形で返す
  return { user, loading };
}
