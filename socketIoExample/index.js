const fs = require('fs');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log(`client connected`);
  console.log("transport: ", socket.conn.transport.name); // "polling"

  fs.readFile('word.docx', (err, data) => {
    console.log('data length, megabytes:', data.byteLength / 1024 / 1024)
    socket.emit('bigData', { data, time: Date.now() });
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
