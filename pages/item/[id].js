import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { getBaseUrl } from "../../lib/baseUrl";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const ReadSingleItem = (props) => {
  return (
    <div className="grid-container-si">
      <Head><title>{props.singleItem.title}</title></Head>
      <div>
        <h1>個別アイテムページ</h1>
        <Image
          src={props.singleItem.image}
          width="750"
          height="500"
          alt="item-image"
        />
      </div>
      <div>
        <h1>{props.singleItem.title}</h1>
        <h2>¥{props.singleItem.price}</h2>
        <hr/>
        <p>{props.singleItem.description}</p>
        <div>
          <Link href={`/item/update/${props.singleItem._id}`}>アイテム編集</Link>
          <Link href={`/item/delete/${props.singleItem._id}`}>アイテム削除</Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const base = getBaseUrl(context.res);

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