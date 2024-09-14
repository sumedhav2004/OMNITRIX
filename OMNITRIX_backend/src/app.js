
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const repoRoutes = require('./routes/repo');
const chatRoutes = require('./routes/chat');

dotenv.config();
connectDB();



const app = express();

// Middleware
app.use(cors({origin:"http://localhost:5173"}));
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repo', repoRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;
