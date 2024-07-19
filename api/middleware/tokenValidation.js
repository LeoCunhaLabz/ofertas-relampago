import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
    const cookies = req.headers.cookie?.split("; ");
    const authHeader = cookies?.find(cookie => cookie.startsWith("accessToken"));
    const token = authHeader && authHeader.split("=")[1];

    if (token){
        try{
            jwt.verify(token, process.env.TOKEN);
            next()
        } catch (error){
            console.log(error);
            res.status(403).send({message:"Token Inválido."})
        }
    } else {
        return res.status(401).send({message:"Token não fornecido"})
    }
}