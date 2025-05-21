const WebSocket = require('ws');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const readMessages = () => {
  try {
    const data = fs.readFileSync('messages.json', 'utf8');
    return data ? JSON.parse(data) : [];  // ✅ Fixed this line
  } catch (err) {
    console.log(err);
    return [];
  }
};

const addMessage = (newMessage) => {
  try {
    const messages = readMessages();
    messages.push(newMessage);
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2), 'utf8');
    console.log('Message Saved Successfully');
  } catch (err) {
    console.log(err);
  }
};

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8080;

const http = require('http').createServer(app);
const server = new WebSocket.Server({ server: http });

server.on('connection', (socket) => {
  console.log('✅ Connection Established');

  socket.on('message', (data) => {
    console.log('socket state: ', socket.readyState);
    const newMessage = {
      id: Date.now(),
      text: data.toString(),
      sender: 'Client',
      timestamp: new Date().toISOString(),
    };
    addMessage(newMessage);
    console.log('socket state after message:', socket.readyState);
    server.clients.forEach((client) => {
      console.log('client state: ', client.readyState);
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Roger That: ${newMessage.text}`);
      }
    });
  });

  socket.on('close', () => console.log('❌ Connection Closed'));
  socket.on('error', (err) => console.log('⚠️ WebSocket Error:', err));
});

// ✅ Fixed req and res order here
app.get('/messages', (req, res) => {
  res.json(readMessages());
});

http.listen(PORT, () => console.log('🚀 Server running on port', PORT));
