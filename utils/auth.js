
import jwt from"jsonwebtoken"

const secret_key = "nextmarket"

const auth = (handler) => {
    return async(req,res) => {
        if(req.method === "GET"){
            return handler(req,res)
        }

        // const token =await req.headers.authorization.split("")[1]

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMwc19keG5AeWFob28uY28uanAiLCJpYXQiOjE3NTM1ODYwNzMsImV4cCI6MTc1MzY2ODg3M30.rjg4yzTSP-agP7iQuJZT15I1W6vISX1M_MHllgKsfZo"

        if(!token){
            return res.status(401).json({message:"トークンがありません"})
        }

        try{
            const decoded = jwt.verify(token,secret_key)
            req.body.email = decoded.email
            return handler(req,res)
        }catch(err){
            return res.status(401).json({message:"トークンが正しくないので、ログインしてください"})
        }
    }
}

export default auth