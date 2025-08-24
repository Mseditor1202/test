
import jwt from"jsonwebtoken";
const secret_key = process.env.JWT || "dev_secret";

const auth = (handler) => {
    return async(req,res) => {
        if(req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
            return handler(req,res);
        }

        const header = req.headers.authorization || "";
        const parts = header.split(" ");
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ message: "トークンがありません"});
        }

        try{
            const decoded = jwt.verify(token,secret)
            if(!decoded.email){
                return res.status(401).json({message:"トークンが正しくないので、ログインしてください"})
            }
            req.user = { email: decoded.email, id: decoded.id };
            return handler(req,res)
        }catch (e) {
            return res.status(401).json({message:"トークンが正しくないので、ログインしてください"})
        }
    };
};

export default auth