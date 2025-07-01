import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    email:{
        type: String,
        required :true,
        unique : true
    },

    fullName :{
        type: String,
        required :true,
        
    },
    password : { 
        type: String,
        required :true,
        minLength : 6
    },
    profilePic:{
        type: String,
        default : ""
    },
    bio:{
        type: String 
    }
    
},{timestamps:true})

const User = mongoose.model("User",userSchema);

export default User;

//steps:
//import 
//schema banao using // const userSchema =  new mongoose.Schema({ object ata hai iske ander})
//model banao using // const User  = mongoose.model("User",userSchema)
//export then 