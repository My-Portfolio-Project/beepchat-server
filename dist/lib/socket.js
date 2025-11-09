"use strict";
// src/lib/socket.ts
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
// Create Express app
const app = express();
// Create HTTP server
const server = http.createServer(app);
// Map userId -> socketId
const userSocketMap = {};
// Helper
const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};
// Create Socket.io server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});
// Handle connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        // Broadcast online users
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        });
    }
});
// Export for CommonJS
module.exports = {
    io,
    server,
    app,
    getReceiverSocketId,
};
