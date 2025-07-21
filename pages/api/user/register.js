
import connectDB from "../../../utils/database"
import { UserModel } from "../../../utils/schemaModels"

const registerUser = async(req,res) => {
    try {
        await connectDB()
        await UserModel.create(req.body)
        return res.status(200).json({message: "ユーザー登録成功"})
    }catch(err){
    console.error("ユーザー登録中にエラーが発生しました:", err); // ★ここが重要
    return res.status(400).json({message:"ユーザー登録失敗", details: err.message})
}
}
export default registerUser