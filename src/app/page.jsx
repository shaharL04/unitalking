'use client'
import Image from "next/image";
import { useState } from "react";
import axios from 'axios'
import './globals.css'
export default function Home() {
    const [inputText, setInputText] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    async function simpleTranslate(){
      try{
        const response = await axios.post("http://localhost:8080/api/translate", {text: inputText});
        console.log(response.data.translatedText);
        setResponseMessage(response.data.translatedText);
      } catch (error) {
        console.error('Error sending request:', error);
        setResponseMessage('An error occurred while sending the request.');
      }
    }
    return (
      <div>
        <p>let's test this translate!</p>
        <input
          placeholder="Text you want to translate"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <br/>
        <button onClick={simpleTranslate}>PUSH ME TO TRANSLATE!</button>
      </div>
    );
}
