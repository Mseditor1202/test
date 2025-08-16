
import Image from "next/image"
import useAuth from "../../../utils/useAuth"

const DeleteItem = (props) => {
  const { user, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://test-kh4y7k874-morishita-shos-projects.vercel.app//api/item/delete/${props.singleItem._id}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      const jsonData = await response.json();
      if (!response.ok) throw new Error(jsonData?.message || "削除に失敗しました")
      alert(jsonData.message);
    } catch (err) {
      alert("アイテム削除に失敗しました");
    }
  };

  if (loading) return null;

  if (user?.email !== props.singleItem.email) {
    return <h1>権限がありません</h1>;
  }
    return (
    <div className="delete-page">
        <Head><title>アイテム削除</title></Head>
      <h1 className="page-title">アイテム削除</h1>
      <form onSubmit={handleSubmit}>
        <h2>{props.singleItem.title}</h2>
        <Image src={props.singleItem.image}width="750" height="500" alt="item-image"/>
        <h3>¥{props.singleItem.price}</h3>
        <p>{props.singleItem.description}</p>
        <button>削除</button>
      </form>
    </div>
  );
};

export default DeleteItem;

export const getServerSideProps = async (context) => {
  const response = await fetch(
    `https://test-kh4y7k874-morishita-shos-projects.vercel.app//api/item/${context.query.id}`
  );
  const singleItem = await response.json();

  return {
    props: singleItem,
  };
};
