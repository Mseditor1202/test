import { useState } from "react";
import useAuth from "../../../utils/useAuth";
import Head from "next/head";
import { notFound } from "next/navigation";

const UpdateItem = (props) => {
  const item = props.singleItem;

  // 取得失敗時に安全にリターン（クライアント例外を防ぐ）
  if (!item) return <h1>アイテムが見つかりませんでした</h1>;

  const [title, setTitle] = useState(item.title ?? "");
  const [price, setPrice] = useState(item.price ?? "");
  const [image, setImage] = useState(item.image ?? "");
  const [description, setDescription] = useState(item.description ?? "");

  const { user, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/item/update/${item._id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // 大文字の Authorization 推奨
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, price, image, description }),
      });

      const ct = response.headers.get("content-type") || "";
      const jsonData = ct.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) throw new Error(jsonData?.message || "編集に失敗しました");
      alert(jsonData.message);
    } catch (err) {
      alert(err.message || "アイテム編集失敗");
    }
  };

  if (loading) return null;
  if (user?.email !== item.email) return <h1>権限がありません</h1>;

  return (
    <div>
      <Head><title>アイテム編集</title></Head>
      <h1 className="page-title">アイテム編集</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" placeholder="アイテム名" required />
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" name="price" placeholder="価格" required />
        <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="画像" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="description" rows={15} placeholder="商品説明" required />
        <button>編集</button>
      </form>
    </div>
  );
};

export default UpdateItem;

export const getServerSideProps = async (context) => {
  try {
    const { id } = context.params || {};
    if (!id || Array.isArray(id)) return { notFound: true };

    const proto = context.req.headers["X-forwarded-proto"] || "http";
    const host = context.req.headers.host;
    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `${proto}://${host}`;

      const url = `${origin}/api/item/${encodeURIComponent(id)}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const ct = (res.headers.get("content-type") || "").toLowerCase();

      console.log("SSR fetch:", url, res.status, ct);

      if (!res.ok || !ct.startsWith("application/json")) {
        if (res.status === 404) return { notFound: true };
        console.error("update page API error:", res.status, ct, headers.slice(0, 200));
        return { props: { singleItem: null } };
      }

      const singleItem = await res.json();
      if (!singleItem || !singleItem._id) return { notFound: true };

      return { props: { singleItem } };
    } catch (e) {
      console.error("SSR error(update page):", e);
      return { props: { singleItem: null } };
    }
  };