import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let rooms = {}; // odaID -> { users: [] }

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = { users: [] };
    rooms[roomId].users.push(socket.id);

    // Odadaki diğer kişilere bilgi gönder
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ targetId, data }) => {
    io.to(targetId).emit("signal", { senderId: socket.id, data });
  });

  socket.on("send-message", ({ roomId, message }) => {
    io.to(roomId).emit("receive-message", { sender: socket.id, message });
  });

  socket.on("send-gift", ({ roomId, gift }) => {
    io.to(roomId).emit("receive-gift", { sender: socket.id, gift });
  });

  socket.on("start-duel", ({ roomId, duelType }) => {
    io.to(roomId).emit("duel-started", { type: duelType });
  });

  socket.on("disconnect", () => {
    console.log("Ayrıldı:", socket.id);
    for (let roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(id => id !== socket.id);
    }
  });
});

server.listen(5000, () => console.log("Server çalışıyor: http://localhost:5000"));
