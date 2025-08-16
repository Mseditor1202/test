import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

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
                width="750"
                height="500"
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

export const getServerSideProps = async () => {
  const response = await fetch("https://test-3uhymtec5-morishita-shos-projects.vercel.app//api/item/readall");
  const allItems = await response.json();

  return {
    props: allItems,
  };
};
