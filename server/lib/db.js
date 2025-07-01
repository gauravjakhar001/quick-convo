// this will setup the connection of the mongoDB with the project and after this we 
//have to make models inside which we will create schemas

import mongoose from "mongoose" 

//Function to connect to the mongoDB database
export const  connectDB = async () =>{
    try {
        mongoose.connection.on('connected',()=> console.log('DataBase Connected'));//console.log("MongoDb Connected");
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
        
    } catch (error) {
        console.log(error);
    }
}