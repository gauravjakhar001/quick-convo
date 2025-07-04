import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext =createContext();

export const ChatProvider = ({children})=>{
    
    const [messages, setMessages] = useState([]);
    const [users,setUsers] =useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages,setUnseenMessages] = useState({});

    const {socket,axios} = useContext(AuthContext);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // If the message is from or to the currently selected user, add to chat
            if (
                selectedUser &&
                (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)
            ) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                // Otherwise, increment unseen count
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                        ? prevUnseenMessages[newMessage.senderId] + 1
                        : 1,
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);

        // Cleanup
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedUser, axios]);

    //function to get all users for sidebar 
    const getUsers = async()=>{
        try {
            const {data} =await axios.get('/api/messages/users');
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    //Function to get messages for selected user

    const getMessages = async (userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {

             toast.error(error.message)
        }
    }

    //function to send message to the selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data} =await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            // if(data.success){
            //     setMessages((prevMessages)=> [...prevMessages,data.newMessage])
            // } else{
            //     toast.error(error.message);
            // }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages

    }

    return  (
        <ChatContext.Provider value= {value}>
            {children}
        </ChatContext.Provider>
    )
}