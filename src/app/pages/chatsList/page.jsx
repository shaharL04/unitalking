'use client'
import React, { useState, useEffect } from 'react';
import ChatItem from '@/src/components/chatItem/ChatItem';
import axios from 'axios';
import './chatsList.css'
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; 

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const ChatsList = () => {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  //retrieve user chats
  useEffect(() => {
    const retrieveAllChatsTheUserHasByTimeOrder = async () => {
      try {
        const response = await axios.post("http://localhost:5000/retrieveAllChatsTheUserHasByTimeOrder",{test: "test"},{withCredentials: true}); 
        console.log("chatList"+JSON.stringify(response.data.sortedChats))
        setChats(response.data.sortedChats);

      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    retrieveAllChatsTheUserHasByTimeOrder();
  }, []);

  
  const chatItemSelected = async (chat) =>{
    const response = await axios.post("http://localhost:5000/getChatUsers",{currentLoggedUser: chat.user_id, chatID: chat.chat_id})
    const userIdsArr = response.data.usersInChats.map((user) => user.user_id);
    console.log("usersInChat"+userIdsArr)

    console.log("chat"+chat.chat_id+" user"+chat.user_id)
    const encryptedSelectedGroupId = encrypt(chat.chat_id.toString());
    const encryptedUsersInGroup = encrypt(userIdsArr.toString());
    const encryptedUserId = encrypt(chat.user_id.toString())
    router.push(`/pages/chat?selectedChatId=${encodeURIComponent(encryptedSelectedGroupId)}&usersInGroup=${encodeURIComponent(encryptedUsersInGroup)}&userId=${encodeURIComponent(encryptedUserId)}`);
  };

  return (
    <div >
      <div className='chatListDiv'>
        {chats.map((chat) => (
            <div className='indevidualChatDiv'>
              <ChatItem 
                key={chat.id}
                chat={chat}
                onClick={() => chatItemSelected(chat)}
              />
            </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsList;
