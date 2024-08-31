'use client'
import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import ChatItem from '@/src/components/chatItem/ChatItem';
import { Modal } from '@mantine/core';
import AddChat from '@/src/components/addChat/addChat';
import axios from 'axios';
import './chatsList.css'
import '@/src/app/daisui.css'
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; 

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const ChatsList = () => {
  const [chats, setChats] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [chatsForAutoComplete, setChatsForAutoComplete] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  //retrieve user chats
  useEffect(() => {
    
    const retrieveAllChatsTheUserHasByTimeOrder = async () => {
      try {
        const response = await axios.post("http://localhost:5000/retrieveAllChatsTheUserHasByTimeOrder",{test: "test"},{withCredentials: true}); 
        console.log("chatList"+JSON.stringify(response.data.sortedChats))
        setChats(response.data.sortedChats);
        createChatsNamesArr(response.data.sortedChats);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    retrieveAllChatsTheUserHasByTimeOrder();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const createChatsNamesArr = (chats) => {
    const chatNamesArr = chats.map((chat) => chat.name);
    console.log(chatNamesArr)
    setChatsForAutoComplete(chatNamesArr);
  };

  
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
      <div className='addNewChatDiv'>
          <img
            src='/open.svg'
            alt="Open Icon"
            className="swap-off fill-current"
            width="32"
            height="32"
            onClick={open}
          />
          <div className='modalChatDiv'>
            <Modal opened={opened} onClose={close} title="New Chat" centered className='modalChat'>
              <AddChat />
            </Modal>
          </div>
      </div>
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
