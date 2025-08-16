import { useState }from "react"
import useAuth from "../../utils/useAuth";
import Head from "next/head";

const CreateItem = () => {
    const { user, loading } = useAuth();
    const [title,setTitle] = useState("")
    const [price,setPrice] = useState("")
    const [image,setImage] = useState("")
    const [description,setDescription] = useState("")

     if (loading) return <p>読み込み中...</p>;
     if (!user?.email) return null; // useAuth 側でログインに誘導済み
 
const handleSubmit = async(e) => {
    e.preventDefault()
    
    const token = localStorage.getItem("token");
    if (!token || !user?.email) {
        alert("ログインが必要です");
        return;
    }

    try{
        const response = await fetch("https://test-phi-one-53.vercel.app//api/item/create",{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "authorization":`Bearer ${localStorage.getItem("token")}`,
            },
            body:JSON.stringify({
                title:title,
                price:price,
                image:image,
                description:description
            }),
        });
        const jsonData = await response.json();
        alert(jsonData.message);
    }catch{
        alert("アイテム作成失敗")
    }
};

    return(
        <div>
            <Head><title>アイテム作成</title></Head>
            <h1 className="page-title">アイテム作成</h1>
            <form onSubmit={handleSubmit}>
                <input value={title}onChange={(e)=>setTitle(e.target.value)} type="text" name="title" placeholder="アイテム名"required/>
                <input value={price}onChange={(e)=>setPrice(e.target.value)}  type="text" name="price" placeholder="価格"required/>
                <input value={image}onChange={(e)=>setImage(e.target.value)}  type="text" name="image" placeholder="画像"required/>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} name="description" rows={15} placeholder="商品説明"required></textarea>
                <button>作成</button>
            </form>
        </div>
    )
  } 

export default CreateItem