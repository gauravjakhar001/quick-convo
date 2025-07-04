import express from "express";
import { protectRoute} from "../middleware/auth.js"
import { getMessages, getUserForSideBar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users",protectRoute,getUserForSideBar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);// using this to update the data that's why put
messageRouter.post("/send/:id", protectRoute,sendMessage);

export default messageRouter;