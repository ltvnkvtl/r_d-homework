import express from "express";
import socketIO from "socket.io";
import { createServer } from "http";
import path from "path";

const app = express();
const http = createServer(app);
const io = socketIO(http);
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
let activeSockets = [];
io.on("connection", socket => {
  const existingSocket = activeSockets.find(
    existingSocket => existingSocket === socket.id
  );

  if (!existingSocket) {
    activeSockets.push(socket.id);

    // обновляем список пользователей на клиенте
    socket.broadcast.emit("update-user-list", {
      users: [socket.id]
    });
  }

  socket.on("call-user", (data: any) => {
    socket.to(data.to).emit("call-made", {
      offer: data.offer,
      socket: socket.id
    });
  });

  socket.on("make-answer", data => {
    socket.to(data.to).emit("answer-made", {
      socket: socket.id,
      answer: data.answer
    });
  });
});

http.listen(5000,() => {
  console.log(`Server is listening on http://localhost:5000`);
});
