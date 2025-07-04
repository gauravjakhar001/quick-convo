// creatoing models for messages
// using this we can store the messages in the MongoDB

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    
    senderId : {
        type: mongoose.Schema.Types.ObjectId, ref:"User" ,required:true
    },
    receiverId :{
        type: mongoose.Schema.Types.ObjectId ,ref:"User" ,required :true
    },
    text: {
        type :String
    },
    image:{
        type :String
    },
    seen : {
        type: Boolean,
        default : false
    }
    
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema);

export default Message;

//steps:
//import 
//schema banao using // const userSchema =  new mongoose.Schema({ object ata hai iske ander})
//model banao using // const User  = mongoose.model("User",userSchema)
//export then 