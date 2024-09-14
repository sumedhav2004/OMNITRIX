// ChatDashboard.js
import React, { useState, useEffect } from 'react';
import ChatRoom from './ChatRoom';
import axios from 'axios';

const ChatDashboard = ({ token }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/chat/rooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(res.data);
      } catch (err) {
        console.error('Error fetching rooms', err);
      }
    };

    fetchRooms();
  }, [token]);

  return (
    <div>
      <h2>Chat Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id} onClick={() => setSelectedRoomId(room._id)}>
            {room.name}
          </li>
        ))}
      </ul>

      {selectedRoomId && <ChatRoom roomId={selectedRoomId} token={token} />}
    </div>
  );
};

export default ChatDashboard;
