import { useState } from "react";
import useAuth from "../../../utils/useAuth";
import Head from "next/head";

const UpdateItem = (props) => {
  const [title, setTitle] = useState(props.singleItem.title);
  const [price, setPrice] = useState(props.singleItem.price);
  const [image, setImage] = useState(props.singleItem.image);
  const [description, setDescription] = useState(props.singleItem.description);

  const { user, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/item/update/${props.singleItem._id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title, price, image, description }),
        }
      );
      const jsonData = await response.json();
      if (!response.ok) throw new Error(jsonData?.message || "編集に失敗しました");
      alert(jsonData.message);
    } catch (err) {
      alert(err.message || "アイテム編集失敗");
    }
  };

  if (loading) return null;
  if (user?.email !== props.singleItem.email) {
    return <h1>権限がありません</h1>;
  }

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
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://${context.req.headers.host}";

    const url = `${origin}/api/item/${context.query.id}`;

    const res = await fetch(url,{
      headers: {
        Accept: "application/json",
        cookie: context.req.headers.cookie || "",
      },
    });

    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.includes("application/json")) {
      if (res.status === 404) return { notFound: true };
      const text = await res.text().catch(() => "");
      console.error("update page API error:", res.status, ct, text.slice(0, 200));
      return { props: { singleItem: null }};
    }

    const singleItem = await res.json();
    return { props: { singleItem } };
  };