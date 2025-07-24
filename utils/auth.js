
import jwt from"jsonwebtoken"

const secret_key = "nextmarket"

const auth = (handler) => {
    return async(req,res) => {
        if(req.method === "GET"){
            return handler(req,res)
        }

        // const token =await req.headers.authorization.split("")[1]

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndlYmVyeS4xMjJAZ21haWwuY29tIiwiaWF0IjoxNzUzMzQ4MjE1LCJleHAiOjE3NTM0MzEwMTV9.cWuBrutFAGk1-Zw46zpWnt9vvmAeng7jMD1_MqmtY0k"

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