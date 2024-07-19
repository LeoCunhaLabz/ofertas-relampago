import jwt from "jsonwebtoken";

export const checkRefreshToken = (req, res, next) => {
    const cookies = req.headers.cookie?.split("; ");
    const authHeader = cookies?.find(cookie => cookie.startsWith("refreshToken"));
    const refresh = authHeader && authHeader.split("=")[1];

    if (refresh){
        try{
            jwt.verify(refresh, process.env.REFRESH);
            next()
        } catch (error){
            console.log(error);
            res.status(403).send({message:"Token Inválido!"})
        }
    } else {
        return res.status(401).send({message:"Token não fornecido"})
    }
}