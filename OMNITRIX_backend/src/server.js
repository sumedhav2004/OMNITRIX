
const app = require('./app');
const { Server } = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');
const { handleChatConnection } = require('./controllers/chatController');
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your client URL
    methods: ['GET', 'POST'],
  },
});

// Socket.io for handling real-time connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token; 
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.user; // Attach the user to the socket instance
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New connection', socket.user.id); // Logs authenticated user ID
  handleChatConnection(socket, io); // Call the chat handling function
});



const PORT = process.env.PORT || 5000;

console.log("MongoUri: ",process.env.MONGO_URI);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//xyRkNFWFWqMeDoX8