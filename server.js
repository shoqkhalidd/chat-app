const express = require('express');
const WebSocket = require('ws');
const path = require('path');


const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});


server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});