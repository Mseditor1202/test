import { useState } from "react";
import useAuth from "../../../utils/useAuth";

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
      <h1>アイテム編集</h1>
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
  const response = await fetch(`http://localhost:3000/api/item/${context.query.id}`);
  const singleItem = await response.json();
  return { props: singleItem };
};