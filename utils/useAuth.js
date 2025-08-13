import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const useAuth = () => {
  const [loginUser, setLoginUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        router.replace("/user/login"); // pushよりreplace
        return;                        // ← 超重要：早期return
      }

      // verifyはしない。payloadだけ読む（本検証はAPIで）
      const p = token.split(".")[1];
      const payload = p ? JSON.parse(atob(p)) : null;

      // exp（有効期限）を使っているならチェック
      if (!payload || (payload.exp && Date.now() / 1000 > payload.exp)) {
        localStorage.removeItem("token");
        router.replace("/user/login");
        return;
      }

      setLoginUser(payload.email ?? null);
    } catch {
      localStorage.removeItem("token");
      router.replace("/user/login");
    }
  }, [router]);

  return loginUser;
};

export default useAuth;