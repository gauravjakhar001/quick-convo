import express from "express";
import "dotenv/config";
import cors from 'cors';
import http from "http";
import { connectDB } from "./lib/db.js";

const app = express();
const server  = http.createServer(app);//bcz soket io support is http server

//Middleware setup 
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status",(req,res)=> res.send("Server is Live"));


//Connect to MongoDb 
await connectDB();


const PORT = process.env.PORT ||9000;

server.listen(PORT,()=> console.log("Server is running on PORT:"+ PORT));
