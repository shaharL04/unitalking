'use client'
import { useState, useEffect,useLayoutEffect } from "react";
import MyCreatedMessages from "@/src/components/MyCreatedMessages";
import OthersCreatedMessages from "@/src/components/OthersCreatedMessages";
import Microphone from "@/src/components/Microphone";
import SendBtn from "@/src/components/sendBtn";
import "@/src/app/daisui.css";
import "./chat.css";
import axios from 'axios'; 

export default function Chat() { 
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [tempVar, setTempVar] = useState('');
  const [hasInput, setHasInput] = useState(false);
  const [sortedMessagesArray, setSortedMessagesArray] = useState([]);
  const [socket, setSocket] = useState(null);

  //Use effect for retriving messages
  useEffect(() => {
    const retreiveMessages = async () => {
      try {
        const response = await axios.post("http://localhost:5000/retrieveChatMessagesInOrder", {
          userId: "1",
          groupId: "9",
        }); 
        setSortedMessagesArray(response.data.SortedMessagesArr);

      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    retreiveMessages();
  }, []);


  // Establish WebSocket connection - START
  useEffect(() => {
    const wsUrl = 'ws://localhost:9000'; 
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log(event.data)
      const data = event.data;
      console.log('Received message:', data);
      setTempVar(data);
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
    if (socket) {
      const targetChatId = '9'; 
      const messageData = {
        targetChatId,
        data: message 
      };

      // Send the message to the WebSocket server
      socket.send(JSON.stringify(messageData));

    }

    const response = await axios.post("http://localhost:5000/newMessage", {
          newMessage:message,
          targetChatId: "9",
    }, { withCredentials: true }); 
    console.log("response after inserting new M"+JSON.stringify(response.data.message))
    setSortedMessagesArray([...sortedMessagesArray,response.data.message] )
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
      <div>
      {
        sortedMessagesArray.map((item, index) => {
          console.log("this is var value:"+tempVar);
          console.log(JSON.stringify(item));
          console.log(item.sender_id);
          return item.sender_id == "1" ? (
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
