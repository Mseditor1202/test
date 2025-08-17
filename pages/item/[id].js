import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

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
  const response = await fetch(
    `https://test-3uhymtec5-morishita-shos-projects.vercel.app/api/item/${context.query.id}`
  );
  const singleItem = await response.json();

  return {
    props: {singleItem},
  };
};

export default ReadSingleItem