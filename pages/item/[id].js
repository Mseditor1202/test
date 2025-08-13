import Image from "next/image";
import Link from "next/link";

const ReadSingleItem = (props) => {
  return (
    <div>
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
          <Link href={`/item/update/${props.singleItem._id}`}><a>アイテム編集</a></Link>
          <Link href={`/item/delete/${props.singleItem._id}`}><a>アイテム削除</a></Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const response = await fetch(
    `http://localhost:3000/api/item/${context.query.id}`
  );
  const singleItem = await response.json();

  return {
    props: {singleItem},
  };
};

export default ReadSingleItem