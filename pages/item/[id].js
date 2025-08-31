import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { getBaseUrl } from "../../lib/baseUrl";

const ReadSingleItem = ({ singleItem }) => {
  if (!singleItem) { 
    return <div>アイテムが見つかりませんでした。</div>;
  }
  
    return (
    <div className="grid-container-si">
      <Head><title>{singleItem.title}</title></Head>
      <div>
        <h1>個別アイテムページ</h1>
        <Image
          src={singleItem.image}
          width={750}
          height={500}
          alt="item-image"
        />
      </div>
      <div>
        <h1>{singleItem.title}</h1>
        <h2>¥{singleItem.price}</h2>
        <hr/>
        <p>{singleItem.description}</p>
        <div>
          <Link href={`/item/update/${singleItem._id}`}>アイテム編集</Link>
          <Link href={`/item/delete/${singleItem._id}`}>アイテム削除</Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const base = getBaseUrl(context.req);

  const res = await fetch(`${base}/api/item/${context.query.id}`,{
    headers: { Accept: "application/json" },
  })
  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("application/json")) {
    if (res.status === 404) return { notFound: true };
    const text = await res.text().catch(() => "");
    console.error("read single API error:", res.status, ct, text.slice(0, 200));
    return { props: { singleItem: null } };
  }

  const singleItem = await res.json();
  return {
    props: {singleItem}
  };
};

export default ReadSingleItem