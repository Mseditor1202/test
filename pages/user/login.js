import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getSafeNext = () => {
    const raw = typeof router.query.next === "string" ? router.query.next : "/";
    return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        let msg = "ログインに失敗しました";
        try {
          if (ct.includes("application/json")) {
            const errJson = await res.json();
            if (errJson?.message) msg = errJson.message;
          } else {
            const errText = await res.text();
            if (errText) msg = errText.slice(0, 200);
          }
        } catch {}
        alert(msg);
        return;
      }

      let msg = "ログインしました";
      try {
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.message) msg = data.message;
        }
      } catch {}
      alert(msg);
      router.replace(getSafeNext());
    } catch (err) {
      alert("ネットワークエラー：ログイン失敗");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Head><title>ログイン</title></Head>
      <h1 className="page-title">ログイン</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="メールアドレス"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="パスワード"
          required
        />
        <button disabled={submitting}>
          {submitting ? "送信中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
