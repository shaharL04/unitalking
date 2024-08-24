import React from 'react';
import '@/src/components/chatItem/chatItem.css';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); 
};

const ChatItem = ({ chat, onClick }) => {
  return (
    <div onClick={onClick} className='ChatItemDivWrapper'>
      <div className="circular-image-container">
          <img src="path-to-your-image.jpg" alt="Profile Image" className="circular-image" />
      </div>
    
      <div className="chat-details">
          <h3 className="text-lg font-semibold">{chat.name}</h3>
          <p className="text-sm text-gray-500">{chat.latest_message_in_chat}</p>
          <p className="text-sm text-gray-500">{formatDate(chat.updated_at)}</p>
      </div>
    </div>
  );
};

export default ChatItem;
