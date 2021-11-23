const io = require("socket.io-client");

// edit to polling HERE!!!!!!!!!!!
const transport = 'websocket';
// const transport = 'polling';

const socket = io("http://localhost:3000", { transports: [transport]});

// client-side
socket.on("connect", () => {
    console.log('client connect to server', socket.id);
});

socket.on("bigData", ({ data, time }) => {
  console.log('transport: ', transport)
  console.log('received data length, megabytes:', data.byteLength / 1024 / 1024);
  console.log('time to send, ms:', Date.now() - time);
});
