// ChatRoom.js
import React, { useState } from 'react';
import { useChat } from './useChat';

const ChatRoom = ({ roomId, token }) => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage } = useChat(roomId, token);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
