import React from 'react';
import '@/src/components/chatItem/chatItem.css';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const timeDiff = now - date; // Time difference in milliseconds

  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

  if (timeDiff < oneWeekInMs) {
    // Less than a week: show short day and time
    return date.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  } else {
    // One week or more: show date and short time
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }
};

const ChatItem = ({ chat, onClick }) => {
  return (
    <div onClick={onClick} className='ChatItemDivWrapper'>
      <div className="circle-image-container">
        <img src={`http://localhost:8080/chatPhotos/${chat.group_photo}`} alt="Profile Image" className="circular-image" />
      </div>
    
      <div className="chat-details">
        <h3 className="text-lg font-semibold">{chat.name}</h3>
        <p className="text-sm text-gray-500">{chat.latest_message_in_chat}</p>
        <div className='DateDiv'>
          <p className="text-sm text-gray-500">{formatDate(chat.updated_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
