
import jwt from"jsonwebtoken"
const secret_key = "nextmarket"

const auth = (handler) => {
    return async(req,res) => {
        if(req.method === "GET"){
            return handler(req,res)
        }
        const authHeader = req.headers.authorization || "";
        const parts = authHeader.split(" ");
        const token =  parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;

        if(!token){
            return res.status(401).json({message:"トークンがありません"})
        }

        try{
            const decoded = jwt.verify(token,secret_key)
            if(!decoded.email){
                return res.status(401).json({message:"トークンが正しくないので、ログインしてください"})
            }
            req.user = { email: decoded.email };
            return handler(req,res)
        }catch(err){
            return res.status(401).json({message:"トークンが正しくないので、ログインしてください"})
        }
    }
}

export default auth