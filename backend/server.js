const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// Socket.IO connection handling
const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user's personal room
  socket.on('join', async (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
      
      // Store user socket mapping in Redis (userId -> socketId)
      await redisClient.set(`socket:${userId}`, socket.id);
      // Also store reverse mapping (socketId -> userId) for cleanup
      await redisClient.set(`user:${socket.id}`, userId);
    }
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      // Create chat room ID
      const chatRoomId = [senderId, receiverId].sort().join('_');

      // Save message to database
      const chatMessage = new ChatMessage({
        senderId,
        receiverId,
        message,
        chatRoomId,
      });

      await chatMessage.save();

      // Populate sender info
      await chatMessage.populate('senderId', 'name profilePhoto');

      // Get receiver socket ID from Redis
      const receiverSocketId = await redisClient.get(`socket:${receiverId}`);

      // Emit to receiver if online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          message: chatMessage,
          senderId,
        });
      }

      // Also emit to sender for confirmation
      socket.emit('message_sent', {
        message: chatMessage,
      });

      // Store message in Redis for offline delivery
      await redisClient.lpush(`messages:${receiverId}`, JSON.stringify(chatMessage));
      await redisClient.expire(`messages:${receiverId}`, 86400); // 24 hours
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', async (data) => {
    const { senderId, receiverId, isTyping } = data;
    const receiverSocketId = await redisClient.get(`socket:${receiverId}`);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        senderId,
        isTyping,
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove socket mapping from Redis
    const userId = await redisClient.get(`user:${socket.id}`);
    if (userId) {
      await redisClient.del(`socket:${userId}`);
      await redisClient.del(`user:${socket.id}`);
    }
  });
});

const PORT = process.env.PORT || 4000;

// Listen on all network interfaces (0.0.0.0) to allow connections from devices on the same network
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is ready`);
  console.log(`Access the server at:`);
  console.log(`  - Local: http://localhost:${PORT}`);
  console.log(`  - Network: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log(`\nTo find your IP address:`);
  console.log(`  - Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1`);
  console.log(`  - Windows: ipconfig`);
});

