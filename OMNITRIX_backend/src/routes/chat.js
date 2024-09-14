const express = require('express');
const { createRoom, getRooms, getRoomMessages } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new chat room
router.post('/rooms', auth, createRoom);

// Get all rooms for a user
router.get('/rooms', auth, getRooms);

// Get message history for a room
router.get('/rooms/:roomId/messages', auth, getRoomMessages);

module.exports = router;
