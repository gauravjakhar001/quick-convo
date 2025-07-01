import jwt, { decode } from "jsonwebtoken"
import User from "../models/User.js";

// middleware is a function that is executed before the controller function 

//authentiction api
// to check whether the user is authenticated or not
//middleware to protect routes

export const protectRoute = async (req,res,next) =>{

    try {
        //token from backend to verify the token recieved 
        const token = req.headers.token;

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({
            success :false,
            message:"User not found"
        })
        
        req.user  = user;
        next();
        

    } catch (error) {
        console.log(error.message);
        res.json({
            success :false,
            message:error.message
        })
    }

}