const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

exports.handleChatConnection = (socket, io) => {
  // Handle joining rooms
  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    const messages = await Message.find({ room: roomId }).populate('sender', 'name'); 
    socket.emit('roomMessages', messages); // Send previous messages
  });

  // Handle sending messages
  socket.on('chatMessage', async ({ roomId, messageContent }) => {
    const message = new Message({
      room: roomId,
      sender: socket.user.id,
      content: messageContent
    });

    await message.save();
    const populatedMessage = await message.populate('sender', 'name');
    io.to(roomId).emit('message', populatedMessage); // Broadcast message to the room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.user.id);
  });
};

// Create a chat room
exports.createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    const room = new ChatRoom({ name, users: [req.user.id] });
    await room.save();
    res.json(room);
  } catch (err) {
    console.error('Create Room Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all chat rooms for the user
exports.getRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ users: req.user.id });
    res.json(rooms);
  } catch (err) {
    console.error('Get Rooms Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get messages for a specific room
exports.getRoomMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ room: roomId }).populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
