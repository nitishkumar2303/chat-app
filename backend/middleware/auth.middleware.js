import jwt from "jsonwebtoken"
import redisClient from "../services/redis.service.js"; // Importing the Redis client for caching

export const authUser = async( req ,res , next)=> {

    try {

        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        // console.log("Token: ", req.cookies.token);
        // console.log("Authorization: ", req.headers.authorization);

        if(!token){
            return res.status(401).send({error:"Unauthorized User"});
        }

        const isBlackListed = await redisClient.get(token); // Check if the token is blacklisted

        if(isBlackListed){
            return res.status(401).send({error:"Unauthorized User"}); // Token is blacklisted
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        // console.log("Decoded user: ", decoded);
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).send({error:"Unauthorized User"})
        
    }
}
