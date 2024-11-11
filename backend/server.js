const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Set up CORS middleware for your frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow the frontend to access the backend
  methods: ['GET', 'POST'], // Allow GET and POST requests
  credentials: true, // Allow cookies or authentication headers if needed
}));

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow the frontend to connect to the socket
    methods: ['GET', 'POST'],
    credentials: true, // Allow cookies or authentication headers if needed
  }
});

let currentPage = 1; // Default starting page for the PDF

// Serve the frontend
app.use(express.static('public'));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current page when a user joins
  socket.emit('page-changed', currentPage);

  // Listen for page changes from any user (including admin)
  socket.on('change-page', (pageNum) => {
    console.log(`Page changed to: ${pageNum}`);
    currentPage = pageNum;
    io.emit('page-changed', pageNum); // Broadcast the page change to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
