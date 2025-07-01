import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";

//Signup new user
export const signup = async (req,res)=>{
    
    const {email,fullName,password,profilePic,bio} = req.body;

    try {

        if(!email || !fullName || !password || !profilePic || !bio){
         return res.json({
            success : false,
            message :"Missing Details"
        })
    }

    const user = User.findOne({email});

    if(user){
        return  res.json({
            success: false,
            message: "Account already exists"
        })
    }

    const salt  = await bcrypt.getSalt(10);
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

//