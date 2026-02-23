const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Room = require("./Room");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("create_room", ({ hostName }) => {
    const roomId = Math.random().toString(36).substring(2, 8);

    const room = new Room(roomId);
    room.addPlayer(socket.id, hostName);

    rooms[roomId] = room;

    socket.join(roomId);

    socket.emit("room_created", { roomId });

    io.to(roomId).emit("update_players", room.getPlayers());
  });

  socket.on("join_room", ({ roomId, playerName }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.addPlayer(socket.id, playerName);
    socket.join(roomId);

    io.to(roomId).emit("update_players", room.getPlayers());
  });

  socket.on("start_game", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.startGame(io, roomId);
  });

  socket.on("draw_data", ({ roomId, stroke }) => {
    io.to(roomId).emit("draw_data", stroke);
  });

  socket.on("guess", ({ roomId, text }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.handleGuess(socket.id, text, io, roomId);
  });

  socket.on("disconnect", () => {
    Object.values(rooms).forEach(room => {
      room.removePlayer(socket.id);
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});