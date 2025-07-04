import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

//Signup new user
export const signup = async (req,res)=>{
    
    const {email,fullName,password,bio} = req.body;

    try {

        if(!email || !fullName || !password  || !bio){
         return res.json({
            success : false,
            message :"Missing Details"
        })
    }

    const user = await User.findOne({email});

    if(user){
        return res.json({
            success: false,
            message: "Account already exists"
        })
    }

    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser  = await User.create({
        fullName,
        email,
        password: hashedPassword,
        bio
    })

    const token = generateToken(newUser._id);

    res.json({
        success:true,
        userData :newUser,
        token,
        message: "Account created Successfully"

    }) 
    } catch (error) {
        console.log(error.message); // This is for terminal.
        res.json({
            success:false,
            message: error.message // This will show the error in real time while running the website.
        })
    }

}

//Controler to Login user 

export const login  = async (req,res)=>{
   
    try {
         const{email,password} = req.body;

        if(!email || !password){
         return res.json({
            success :false,
            message : "Missing Details while Logging"
         })
    }     
        // jo user ne email and password diye hai vo check krne hai ki signup hua vo user ya nhi

        const userData  = await User.findOne({email});

        if (!userData) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordCorrect  = await bcrypt.compare(password,userData.password); //userData mongoDB me store hai 

        if(!isPasswordCorrect){
            return res.json({
                success:false,
                message :"Invalid credentials"
            })
        }

        const token = generateToken(userData._id);

        return res.json({
            success:true,
            userData,
            token,
            message :"Login Successful"
        })


        
    } catch (error) {
         console.log(error.message); // This is for terminal.
        res.json({
            success:false,
            message: error.message // This will show the error in real time while running the website.
        })
    }
    


}

//Controller function to check the if user authenticated 

export const checkAuth = (req,res)=>{
    res.json({
        success: true,
        user : req.user
    });
}

//Controller function to update their profile (including their image updation)

//steps
//1) setup the cloudinary so that the user can store images in the cloudinary/cloud storage
//profile ke liye chaiye - image , fullName , Bio of person 

export const updateProfile = async(req,res)=>{

    try {
        const {profilePic, bio,fullName} = req.body;

        const userId  = req.user._id;

        let updatedUser;
        //user -> this is the id comming from the frontend whose so ever is trying to modify the details 
        //User -> this is the user details already stored within the database

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
        }else{
            
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId,{profilePic : upload.secure_url,bio,fullName},{new:true});

        }

        res.json({
            success:true,
            user:updatedUser
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })
    }
}

// now I have to create the api end point for these controller functions but for this I have to first 
// create the routes



