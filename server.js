const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

function randomName() {
  return `User#${Math.floor(1000 + Math.random() * 9000)}`;
}

io.on("connection", (socket) => {
  const username = randomName();

  socket.emit("username", username);

  socket.broadcast.emit("system", `${username} joined the chat`);

  socket.on("chat message", (message) => {
    if (typeof message !== "string") return;

    message = message.trim();

    if (!message || message.length > 500) return;

    io.emit("chat message", {
      username,
      message
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("system", `${username} left the chat`);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Chatroom running on port ${PORT}`);
});
