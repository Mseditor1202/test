// pages/item/update/[id].js
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const cookies = parse(ctx.req.headers.cookie || "");
  const token = cookies.token || cookies.jwt || "";
  if (!token) {
    return { redirect: { destination: `/user/login?next=${encodeURIComponent(ctx.resolvedUrl)}`, permanent: false } };
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return { redirect: { destination: `/user/login?next=${encodeURIComponent(ctx.resolvedUrl)}`, permanent: false } };
  }
  return { props: { id } };
}

export default function UpdateItemPage({ id }) {
  const [item, setItem] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const READ_API = `/api/item/${id}`;          // あなたのGET APIに合わせて必要なら変更
  const UPDATE_API = `/api/item/update/${id}`;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(READ_API, { credentials: "same-origin" });
        if (res.status === 401) {
          location.href = `/user/login?next=${encodeURIComponent(location.pathname + location.search)}`;
          return;
        }
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItem(data.item || data.data || data);
      } catch (e) {
        setErr(e.message || "読み込みに失敗しました");
      }
    })();
  }, [READ_API]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    const fd = new FormData(e.currentTarget);
    const body = {
      title: String(fd.get("title") || ""),
      // price はAPI側で String 化するのでここはそのまま
      price: fd.get("price") ?? "",
      image: String(fd.get("image") || ""),
      description: String(fd.get("description") || ""),
    };
    try {
      const res = await fetch(UPDATE_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "更新に失敗しました");
      setItem(data.item);     // ★更新後のドキュメントで即反映
      setMsg("更新しました");
    } catch (e) {
      setErr(e.message || "通信エラー");
    }
  }

  if (!item && !err) return <p>読み込み中...</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">編集: {item?._id}</h1>

      <label className="block">
        <span>タイトル</span>
        <input name="title" defaultValue={item?.title || ""} className="w-full border p-2 rounded" />
      </label>

      <label className="block">
        <span>価格</span>
        <input name="price" type="number" defaultValue={item?.price ?? ""} className="w-full border p-2 rounded" />
      </label>

      <label className="block">
        <span>画像URL</span>
        <input name="image" defaultValue={item?.image || ""} className="w-full border p-2 rounded" />
      </label>

      <label className="block">
        <span>説明</span>
        <textarea name="description" defaultValue={item?.description || ""} className="w-full border p-2 rounded" rows={4} />
      </label>

      <button type="submit" className="px-4 py-2 rounded bg-black text-white">更新</button>
      {msg && <p style={{ color: "seagreen" }}>{msg}</p>}
    </form>
  );
}
