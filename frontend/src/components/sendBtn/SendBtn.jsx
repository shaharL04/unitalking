import React from "react"
import './sendBtn.css'
export default function SendBtn({onClick}){
    return (
      <div className="returnButton circular-image-container-snd-btn"> 
        <button onClick={onClick}>
            <img src="/sendBtn.svg" alt="Plus icon" className="" /> 
        </button>
      </div>
      );
}