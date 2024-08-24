'use client'
import { useState, useEffect,useLayoutEffect } from "react";
import MyCreatedMessages from "@/src/components/MyCreatedMessages";
import OthersCreatedMessages from "@/src/components/OthersCreatedMessages";
import Microphone from "@/src/components/Microphone";
import SendBtn from "@/src/components/sendBtn";
import "@/src/app/daisui.css";
import "./chat.css";
import axios from 'axios'; 
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { closeOnEscape } from "@mantine/core";


const SECRET_KEY = 'your-secret-key'; 


const decrypt = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};


export default function Chat() { 
  const [message, setMessage] = useState('');
  const [hasInput, setHasInput] = useState(false);
  const [sortedMessagesArray, setSortedMessagesArray] = useState([]);
  const [socket, setSocket] = useState(null);
  const [decryptedGroupId, setDecryptedGroupId] = useState(null);
  const [decryptedUsersInGroupArr, setDecryptedUsersInGroupArr] = useState([]);
  const [decryptedUserId, setDecryptedUserId] = useState(null);

  useEffect(() => {
    const retrieveValuesFromUrl = async () => {
      const query = new URLSearchParams(window.location.search);
      const encrypteGroupId = query.get('selectedChatId');
      const encrypteUsersInGroupId = query.get('usersInGroup');
      const encrypteUserId = query.get('userId');
      if (encrypteGroupId && encrypteUserId) {
        try {
          const decryptedGroupIdString = decrypt(encrypteGroupId);

          const decryptedUsersInGroup = decrypt(encrypteUsersInGroupId);
          const usersInGroupArray = decryptedUsersInGroup.split(',');
          console.log("decrypted chat users+:"+Array.isArray(usersInGroupArray) +"  "+ usersInGroupArray )
          const decryptedUserIdString = decrypt(encrypteUserId);

          setDecryptedGroupId(decryptedGroupIdString);
          setDecryptedUsersInGroupArr(usersInGroupArray)
          setDecryptedUserId(decryptedUserIdString);

          await retrieveMessages(decryptedGroupIdString, decryptedUserIdString);
        } catch (error) {
          console.error("Error decrypting user IDs:", error);
        }
      }
    };

    retrieveValuesFromUrl();
  }, []); 

  const retrieveMessages = async (decryptedGroupIdString, decryptedUserIdString) => {
    try {
      const response = await axios.post("http://localhost:5000/retrieveChatMessagesInOrder", {
        userId: decryptedUserIdString,
        groupId: decryptedGroupIdString,
      });
      console.log("all of the messages in this chat group"+JSON.stringify(response.data.SortedMessagesArr));
      setSortedMessagesArray(response.data.SortedMessagesArr); 

    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };


  // Establish WebSocket connection - START
  useEffect(() => {
    const wsUrl = 'ws://localhost:9000'; 
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log(event.data)
      const data = JSON.parse(event.data);
      console.log('Received message Object:', data);
      setSortedMessagesArray(prevMessages => [...prevMessages, data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed');
      console.log('Code:', event.code); 
      console.log('Reason:', event.reason); 
      console.log('WasClean:', event.wasClean);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);
  // Establish WebSocket connection - END

  const handleTextAreaChange = (event) => {
    setMessage(event.target.value);
    setHasInput(event.target.value !== '');
  };

  const sendText = async() => {
    const response = await axios.post("http://localhost:5000/newMessage", {
      newMessage:message,
      targetChatId: decryptedGroupId,
      }, { withCredentials: true }); 
      console.log("response after inserting new M"+JSON.stringify(response.data.message))
      setSortedMessagesArray(prevMessages => [...prevMessages, response.data.message]);

    if (socket) {
      const targetChatUserIdArr = decryptedUsersInGroupArr; 
      const messageData = {
        targetChatUserIdArr,
        data: response.data.message 
      };
      // Send the message to the WebSocket server
      socket.send(JSON.stringify(messageData));
    }

    setMessage('');
  }
  // LATER DEVELOPMENT OF TEXT BEING TRANSLATED - STARTED

  // const translateText = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/translate", { text: message });
  //     console.log(response.data.translatedText);
  //     setResponseMessage(response.data.translatedText);
  //   } catch (error) {
  //     console.error('Error sending request:', error);
  //     setResponseMessage('An error occurred while sending the request.');
  //   }
  // };

  // const handleMicrophoneClick = () => {
  //   console.log('Microphone clicked');
  // };

  // LATER DEVELOPMENT OF TEXT BEING TRANSLATED - END


  return (
    <div className="App">
      <div className="messagesDiv">
      {
        sortedMessagesArray.map((item, index) => {

          return item.sender_id == decryptedUserId ? (
            <MyCreatedMessages key={index} message={item.content} />
          ) : (
            <OthersCreatedMessages key={index} message={item.content} />
          );

        })
      }
      </div>
      <div className="MessagesInput"> 
        <textarea 
          className="textarea textarea-bordered textAreaInput"
          value={message}
          onChange={handleTextAreaChange} 
        /> 

        <div className="svg-wrapper-container">
          <div className={`svg-wrapper `}>

            {hasInput ? (
              <SendBtn 
              onClick={sendText}
               />
            ) : (
              <Microphone 

               />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
