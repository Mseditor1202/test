import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { getBaseUrl } from "../lib/baseUrl";

const ReadAllItems = (props) => {
  return (
    <div>
      <Head><title>Next Market</title></Head>

      <div className="grid-container-in">
        {Array.isArray(props.allItems) && props.allItems.length > 0 ? (
          props.allItems.map((item) => (
            <Link href={`/item/${item._id}`} key={item._id}>
              <div className="card">
                <Image
                  src={item.image || "/noimage.png"}
                  width={750}
                  height={500}
                  alt="item-image"
                />
                <div className="texts-area">
                  <h2>¥{item.price ?? 0}</h2>
                  <h3>{item.title ?? "タイトルなし"}</h3>
                  <p>
                    {(item.description ?? "").slice(0, 80)}
                    {item.description ? "..." : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>アイテムがありません（または取得に失敗しました）。</p>
        )}
      </div>
    </div>
  );
};

export default ReadAllItems;

export const getServerSideProps = async (context) => {
  const base = getBaseUrl(context.req);
  const url = `${base}/api/item/readall`;

  const res = await fetch(url, { headers: { Accept: "application/json", cookie: context.req.headers.cookie || "" } });
  const ct = res.headers.get("content-type") || "";
  console.log("[index] readall status:", res.status, "ct:", ct, "url:", url);

  if (!res.ok || !ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    console.error("readall API error:", res.status, ct, text.slice(0, 200));
    return { props: { allItems: [] } };
  }

  const data = await res.json();
  const allItems = Array.isArray(data) ? data : data.allItems ?? [];
  console.log("[index] readall count:", allItems.length);
  return { props: { allItems } };
};