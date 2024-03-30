const Message = require('./models/Message.model');
// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);

// WebSocket connection
io.on('connection', socket => {
  console.log('Client connected');

  // Listen for new messages
  socket.on('sendMessage', async data => {
    try {
      const { sender, receiver, message } = data;
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();
      // Emit message to sender and receiver
      io.to(sender).emit('message', newMessage);
      io.to(receiver).emit('message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes');
app.use('/api', indexRoutes);
const userRoutes = require('./routes/users.routes');
app.use('/api', userRoutes);
const cameraRoutes = require('./routes/cameras.routes');
app.use('/api', cameraRoutes);
const messageRoutes = require('./routes/messages.routes');
app.use('/api', messageRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
