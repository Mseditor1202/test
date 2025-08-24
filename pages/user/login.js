import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      })

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        let msg = "ログインに失敗しました";
        try {
          if (ct.includes("application/json")){
            const err = await res.json();
            if (err?.message) serverMsg = errJson.message;
          }else{
            const errText = await res.text();
            if (errText) msg = text.slice(0,200);
          }
        } catch {}
        alert(msg);
        return;
      }

      const json = ct.includes("application/json") ? await res.json() :{};
      const token = json?.token;
      if (!token) {
        alert("サーバーからトークンを受け取れませんでした。");
        return;
      }

      localstorage.setItem("token",token);
      alert(json?.message || "ログインしました。");
      router.push("/");
    } catch (err) {
      alert("ネットワークエラー：ログイン失敗")
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
};

