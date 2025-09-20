// pages/item/create.js
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useAuth from "../../utils/useAuth";

export default function CreateItem() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <p>読み込み中...</p>;
  if (!user?.email) return null; // useAuth 側でログインに誘導済み

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("ログインが必要です");
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/item/create", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`, // ★ API側でBearer or Cookieを拾う実装
        },
        body: JSON.stringify({ title, price, image, description }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "作成に失敗しました");

      // ★ 作成直後に詳細ページへ
      if (data?.item?._id) {
        router.replace(`/item/${data.item._id}`);
      } else {
        alert("作成は成功しましたが、ID取得に失敗しました。");
      }
    } catch (err) {
      alert(err?.message || "アイテム作成失敗");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Head><title>アイテム作成</title></Head>
      <h1 className="page-title">アイテム作成</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" name="title" placeholder="アイテム名" required />
        <input value={price} onChange={(e)=>setPrice(e.target.value)} type="text" name="price" placeholder="価格" required />
        <input value={image} onChange={(e)=>setImage(e.target.value)} type="text" name="image" placeholder="画像" required />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} name="description" rows={15} placeholder="商品説明" required />
        <button disabled={busy}>{busy ? "作成中..." : "作成"}</button>
      </form>
    </div>
  );
}
