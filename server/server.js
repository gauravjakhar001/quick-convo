import express from "express";
import "dotenv/config";
import cors from 'cors';
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//Create Express app and HTTP server
const app = express();
const server  = http.createServer(app);//bcz soket io support is http server

//Initialize socket.io server

export const io = new Server(server ,{
    cors : {origin :"*"}
})

//Store online users 
export const userSocketMap = {};

//Socket.io connection handler
io.on("connection",(socket)=>{
    const userId  = socket.handshake.query.userId;
    console.log("User Connected",userId);

    if(userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))

    })
    
})

//Middleware setup 
app.use(express.json({limit: "4mb"}));
app.use(cors());


//Routes setup 
app.use("/api/status",(req,res)=> res.send("Server is Live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);


//Connect to MongoDb 
await connectDB();

//if local host hai to hi run krega ye nhi to nhi krega 
if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 9000;
    server.listen(PORT,()=> console.log(`Server is running on the port ${PORT}`));
}

//export server for vercel
export default server;
