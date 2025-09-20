// pages/item/delete/[id].js
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { getBaseUrl } from "../../../lib/baseUrl"; // ない場合は自作/削除してもOK

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;

  // ★ ログインチェック（CookieのJWT）
  const cookies = parse(ctx.req.headers.cookie || "");
  const token = cookies.token || cookies.jwt || "";
  if (!token) {
    return {
      redirect: {
        destination: `/user/login?next=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return {
      redirect: {
        destination: `/user/login?next=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  // 単体取得（自分のGET APIパスに合わせて）
  const base = typeof getBaseUrl === "function" ? getBaseUrl(ctx.req) : "";
  const res = await fetch(`${base}/api/item/${encodeURIComponent(id)}`, {
    headers: {
      Accept: "application/json",
      cookie: ctx.req.headers.cookie || "",
    },
  });

  if (res.status === 404) {
    return { notFound: true };
  }

  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    console.error("read single (delete page) error:", res.status, ct, text.slice(0, 200));
    return { props: { singleItem: null } };
  }

  const data = await res.json();
  const singleItem = data?.item ?? data;

  return { props: { singleItem } };
}

export default function DeleteItem({ singleItem }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!singleItem) setErr("アイテムが見つかりませんでした。");
  }, [singleItem]);

  async function handleDelete() {
    if (!confirm("本当に削除しますか？この操作は取り消せません。")) return;
    setBusy(true); setErr("");
    try {
      const res = await fetch(`/api/item/delete/${singleItem._id}`, {
        method: "DELETE",
        credentials: "same-origin", // Cookieのtoken/jwtが送られる
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "削除に失敗しました");
      // 一覧へ（パスはあなたの実装に合わせて変更）
      router.replace("/item");
    } catch (e) {
      setErr(e.message || "通信エラー");
    } finally {
      setBusy(false);
    }
  }

  if (!singleItem) return <p>読み込み中...</p>;

  return (
    <div className="delete-page">
      <Head><title>アイテム削除</title></Head>
      <h1 className="page-title">アイテム削除</h1>

      <div className="border rounded p-4 space-y-2">
        <h2>{singleItem.title}</h2>
        <Image src={singleItem.image} width={750} height={500} alt="item-image" />
        <h3>¥{singleItem.price}</h3>
        <p>{singleItem.description}</p>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <button
        onClick={handleDelete}
        disabled={busy}
        className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-60"
      >
        {busy ? "削除中..." : "削除"}
      </button>
    </div>
  );
}
