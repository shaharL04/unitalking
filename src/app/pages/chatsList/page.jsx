'use client'
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import ChatItem from '@/src/components/chatItem/ChatItem';
import { Modal } from '@mantine/core';
import AddChat from '@/src/components/addChat/addChat';
import axios from 'axios';
import './chatsList.css'
import Alerts from "@/src/components/Alerts";
import { useRouter } from 'next/navigation';
import Header from '@/src/components/header/Header';
import Footer from '@/src/components/footer/Footer';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; 

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const ChatsList = () => {
  const [chats, setChats] = useState([]);
  const [newChatWasCreated,setNewChatWasCreated] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [chatsForAutoComplete, setChatsForAutoComplete] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [newChatData, setNewChatData] = useState({
    groupName: '',
    groupImage: null,
    selectedMembers: []
  });
  const router = useRouter();

  //retrieve user chats
  const retrieveAllChatsTheUserHasByTimeOrder = async () => {
    try {
      setAlerts([]); // Clear existing alerts before making the request
      const response = await axios.post(
        "http://localhost:8080/retrieveAllChatsTheUserHasByTimeOrder", 
        { test: "test" }, 
        { withCredentials: true }
      );
      
      console.log("chatList: " + JSON.stringify(response.data.sortedChats));
      setChats(response.data.sortedChats);
      createChatsNamesArr(response.data.sortedChats);
    } catch (error) {
      if (error.response) {
        setAlerts([error.response.data]); // Handle server-side errors
        console.error('Error fetching chat messages:', error.response.data);
      } else {
        console.error('Error fetching chat messages:', error.message); // General errors
      }
    }    
  };
  
  useEffect(() =>{
    const checkIfUserAuthTokenExist = async () => {
      const response = await axios.get("http://localhost:8080/checkToken",{withCredentials: true})
      console.log(response.data.isAuth)
      if(!response.data.isAuth){
        router.push('/pages/login')
      }

    }
    checkIfUserAuthTokenExist()
  },[])

  useEffect(() => {
    retrieveAllChatsTheUserHasByTimeOrder();
  }, [newChatWasCreated]);


  // create new chat useEffect - START
  useEffect(() =>{
    if(newChatData.groupImage != null && newChatData.groupName && newChatData.selectedMembers.length > 0) {

      const createNewChat = async () => {
        try {
          setAlerts([]); // Clear existing alerts before making the request
          const formData = new FormData();
          
          formData.append('groupName', newChatData.groupName);
          formData.append('groupMembersArr', JSON.stringify(newChatData.selectedMembers)); 
          formData.append('groupImage', newChatData.groupImage);
          
          const response = await axios.post(
            "http://localhost:8080/createNewChat", 
            formData, 
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data' 
              }
            }
          );
          
          setNewChatWasCreated(true);
          console.log('Response:', response.data);
        } catch (error) {
          if (error.response) {
            setAlerts([error.response.data]); // Handle server-side errors
            console.error('Error creating new chat:', error.response.data);
          } else {
            console.error('Error creating new chat:', error.message); // General errors
          }
        }        
      };
      

      createNewChat();
    }
  },[newChatData])


  const handleNewChatData = (data) => {
    setNewChatData(data);
    console.log("Received Chat Data:", data);
  };
  // create new chat useEffect - END




  const createChatsNamesArr = (chats) => {
    const chatNamesArr = chats.map((chat) => chat.name);
    console.log(chatNamesArr)
    setChatsForAutoComplete(chatNamesArr);
  };

  
  const chatItemSelected = async (chat) =>{
    let userIdsArr;
    try {
      setAlerts([]); // Clear existing alerts before making the request
      const response = await axios.post(
        "http://localhost:8080/getChatUsers", 
        {
          currentLoggedUser: chat.user_id,
          chatID: chat.chat_id
        }
      );
      
      console.log('Chat users response:', response.data);
      userIdsArr = response.data.usersInChats.map((user) => user.user_id);
    } catch (error) {
      if (error.response) {
        setAlerts([error.response.data]); // Handle server-side errors
        console.error('Error fetching chat users:', error.response.data);
      } else {
        console.error('Error fetching chat users:', error.message); // General errors
      }
    }
    console.log("usersInChat"+userIdsArr)

    console.log("chat"+chat.chat_id+" user"+chat.user_id)
    const encryptedSelectedGroupId = encrypt(chat.chat_id.toString());
    const encryptedUsersInGroup = encrypt(userIdsArr.toString());
    const encryptedUserId = encrypt(chat.user_id.toString())
    router.push(`/pages/chat?selectedChatId=${encodeURIComponent(encryptedSelectedGroupId)}&usersInGroup=${encodeURIComponent(encryptedUsersInGroup)}&userId=${encodeURIComponent(encryptedUserId)}`);
  };

  return (
    <div className='chatsListPageDiv'>
      <Header/>
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
        <Alerts alerts={alerts}/>
      </div>
      <div className='addNewChatDiv'>
          <div className='modalChatDiv'>
            <Modal opened={opened} onClose={close} title="New Chat" centered className='modalChat'>
              <AddChat newChatHandler={handleNewChatData} />
            </Modal>
          </div>
      </div>
      <Footer onClickFunc = {open}/>
    </div>
  );
};

export default ChatsList;
