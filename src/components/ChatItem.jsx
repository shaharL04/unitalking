import React from 'react';

const ChatItem = ({ chat, onClick, isSelected }) => {
  return (
    <div onClick={onClick}>
      <h3 className="text-lg font-semibold">{chat.name}</h3>
      <p className="text-sm text-gray-500">{chat.lastMessage}</p>
    </div>
  );
};

export default ChatItem;
