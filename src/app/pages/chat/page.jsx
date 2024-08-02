'use client'
import { useState, useEffect } from "react";
import MyCreatedMessages from "@/src/components/MyCreatedMessages";
import OthersCreatedMessages from "@/src/components/OthersCreatedMessages";
import Microphone from "@/src/components/Microphone";
import SendBtn from "@/src/components/sendBtn";
import "@/src/app/daisui.css";
import "./chat.css";
import axios from 'axios'; // Ensure axios is imported

export default function Chat() { // Component name should be capitalized
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [hasInput, setHasInput] = useState(false);

  // use effect for retriving messages
  useEffect(async () => {
    try{

      const response =  await axios.post("http://localhost:8080/retrieveChatMessagesInOrder", {userId: "1", otherUserId: "2"})
    }catch(error){

    }
  },[])


  const handleTextAreaChange = (event) => {
    setMessage(event.target.value);
    setHasInput(event.target.value !== '');
  };

  const translateText = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/translate", { text: message });
      console.log(response.data.translatedText);
      setResponseMessage(response.data.translatedText);
    } catch (error) {
      console.error('Error sending request:', error);
      setResponseMessage('An error occurred while sending the request.');
    }
  };

  const handleMicrophoneClick = () => {
    console.log('Microphone clicked');
    // Add functionality for microphone click here
    event.stopPropagation();
  };


  return (
    <div className="App">
      <MyCreatedMessages message={responseMessage} />
      <OthersCreatedMessages />
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
              onClick={translateText}
               />
            ) : (
              <Microphone 
              onClick={handleMicrophoneClick}
               />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
