// useChat.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = "http://localhost:3000"; // Your backend server URL

export const useChat = (roomId, token) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      auth: {
        token: `Bearer ${token}`,  // Send the JWT token for authentication
      },
    });

    setSocket(newSocket);

    // Join the specific room
    newSocket.emit('joinRoom', roomId);

    // Listen for incoming messages
    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, token]);

  // Function to send a message
  const sendMessage = (messageContent) => {
    if (socket) {
      socket.emit('chatMessage', { roomId, messageContent });
    }
  };

  return { messages, sendMessage };
};
