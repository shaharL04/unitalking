'use client'
import React, { useState, useEffect } from 'react';
import ChatItem from '@/src/components/ChatItem';
import axios from 'axios';
import './chatsList.css'

const ChatsList = () => {
  const [chats, setChats] = useState([]);

  //retrieve user chats
  useEffect(() => {
    const retrieveAllChatsTheUserHasByTimeOrder = async () => {
      try {
        const response = await axios.post("http://localhost:5000/retrieveAllChatsTheUserHasByTimeOrder",{test: "test"},{withCredentials: true}); 
        setChats(response.data.sortedChats);

      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    retrieveAllChatsTheUserHasByTimeOrder();
  }, []);

  
  const chatItemSelected = async (chat) =>{
    const response = await axios.post("http://localhost:5000/getChatUsers",{currentLoggedUser: chat.user_id, chatID: chat.chat_id})
    console.log(response.data.usersInChats)
  };

  return (
    <div >
      <div className='chatListDiv'>
        {chats.map((chat) => (
          <ChatItem className = 'chatItemWrapper'
            key={chat.id}
            chat={chat}
            onClick={() => chatItemSelected(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatsList;
