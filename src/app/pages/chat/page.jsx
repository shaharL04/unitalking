'use client'
import { useState, useEffect,useLayoutEffect } from "react";
import MyCreatedMessages from "@/src/components/myMessages/MyCreatedMessages";
import OthersCreatedMessages from "@/src/components/otherMessages/OthersCreatedMessages";
import SendBtn from "@/src/components/sendBtn/sendBtn";
import "@/src/app/daisui.css";
import Alerts from "@/src/components/Alerts";
import "./chat.css";
import axios from 'axios'; 
import Header from "@/src/components/header/Header";
import CryptoJS from 'crypto-js';


const SECRET_KEY = 'your-secret-key'; 


const decrypt = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};


export default function Chat() { 
  const [message, setMessage] = useState('');
  const [chatObject, setChatObject] = useState({})
  const [sortedMessagesArray, setSortedMessagesArray] = useState([]);
  const [alerts, setAlerts] = useState([]);
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

          await getChatInfo(decryptedGroupIdString)
          await retrieveMessages(decryptedGroupIdString, decryptedUserIdString);
        } catch (error) {
          console.error("Error decrypting user IDs:", error);
        }
      }
    };

    retrieveValuesFromUrl();
  }, []); 

  const getChatInfo = async (groupId) =>{
    try {
      setAlerts([]);
      const response = await axios.post("http://localhost:8080/getChatInfoByChatId", {
        groupId: groupId,
      });
      console.log("this is chat Info: " + JSON.stringify(response.data.chatObject.name));
      
      setChatObject({
        chatName: response.data.chatObject.name,
        chatImage: response.data.chatObject.group_photo[0].pathToPhoto,
      });
    } catch (error) {
      if (error.response) {
        setAlerts([error.response.data]); // Handle server-side errors
        console.error('Error getting chat info:', error.response.data);
      } else {
        console.error('Error getting chat info:', error.message); // General errors
      }
    }    
  }

  const retrieveMessages = async (decryptedGroupIdString, decryptedUserIdString) => {
    try {
      setAlerts([]); 
      const response = await axios.post("http://localhost:8080/retrieveChatMessagesInOrder", {
        userId: decryptedUserIdString,
        groupId: decryptedGroupIdString,
      });
      
      console.log("All of the messages in this chat group: " + JSON.stringify(response.data.SortedMessagesArr));
      setSortedMessagesArray(response.data.SortedMessagesArr);
    } catch (error) {
      if (error.response) {
        setAlerts([error.response.data]); // Handle server-side errors
        console.error('Error fetching chat messages:', error.response.data);
      } else {
        console.error('Error fetching chat messages:', error.message); // General errors
      }
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

  };

  const sendText = async () => {
    try {
      setAlerts([]); // Clear existing alerts before making the request
      const response = await axios.post("http://localhost:8080/newMessage", {
        newMessage: message,
        targetChatId: decryptedGroupId,
      }, { withCredentials: true });
  
      const translatedResponse = await axios.post("http://localhost:8080/translateNewMessage", {
        newMessageForTranslate: response.data.message,
      }, { withCredentials: true });
  
      console.log("Response after inserting new message: " + JSON.stringify(translatedResponse.data));
      setSortedMessagesArray(prevMessages => [...prevMessages, translatedResponse.data.message]);
  
      if (socket) {
        const targetChatUserIdArr = decryptedUsersInGroupArr;
        const messageData = {
          targetChatUserIdArr,
          data: response.data.message,
        };
        socket.send(JSON.stringify(messageData)); // Send the message to the WebSocket server
      }
  
      setMessage('');
    } catch (error) {
      if (error.response) {
        setAlerts([error.response.data]); // Handle server-side errors
        console.error('Error sending message:', error.response.data);
      } else {
        console.error('Error sending message:', error.message); // General errors
      }
    }
  };
  



  return (
    <div className="App">
      <Header type='cList' chatObject={chatObject} />
      <div className="specificChatDiv">
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
        <Alerts alerts={alerts}/>
        </div>
        <div className="MessagesInput"> 
          <textarea 
            className="textAreaInput"
            value={message}
            onChange={handleTextAreaChange} 
          /> 
          <SendBtn onClick={sendText}/>

        </div>
      </div>
    </div>
  );
}
