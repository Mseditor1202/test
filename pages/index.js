import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { getBaseUrl } from "../lib/baseUrl";

const ReadAllItems = (props) => {
  return (
    <div>
      <Head><title>Next Market</title></Head>
      <div className="grid-container-in">
        {props.allItems.map(item => 
          <Link href={`/item/${item._id}`} key={item._id}>
            <div className="card">
              <Image
                src={item.image}
                width={750}
                height={500}
                alt="item-image"
              />
              <div className="texts-area">
                <h2>¥{item.price}</h2>
                <h3>{item.title}</h3>
                <p>{item.description.substring(0, 80)}...</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReadAllItems;

export const getServerSideProps = async (context) => {
  const base = getBaseUrl(context.req);
  const res = await fetch(`${base}/api/item/readall`,{
    headers: { Accept: "application/json" },
  });

  const ct = res.headers.get("content-type") || "";
  if(!res.ok || !ct.includes("application/json")){
    const text = await res.text();
    console.error("readall API error:", res.status, ct, text.slice(0, 200));
    return { props: { allItems: [] } };
  }

  const data = await res.json();
  const allItems = Array.isArray(data) ? data : data.allItems ?? [];
  return {
    props: { allItems }
  };
};
