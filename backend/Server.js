const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const roomController = require("./controller/roomController");
const { requireFields, normalizeRoomCodeParam } = require("./Middleware/validateRequest");
const { notFound, errorHandler } = require("./Middleware/errorHandler");
const quizService = require("./Services/quizService");
const roomService = require("./Services/roomService");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QuizGame backend is running",
  });
});

app.get("/api/rooms", roomController.listRooms);
app.post(
  "/api/rooms",
  requireFields(["title", "topic", "numQuestions", "difficulty", "hostName"]),
  roomController.createRoom,
);

app.get("/api/rooms/:roomCode", normalizeRoomCodeParam, roomController.getRoom);

app.post(
  "/api/rooms/:roomCode/join",
  normalizeRoomCodeParam,
  requireFields(["playerName"]),
  roomController.joinRoom,
);

app.post(
  "/api/rooms/:roomCode/start",
  normalizeRoomCodeParam,
  roomController.startRoom,
);

app.post(
  "/api/rooms/:roomCode/generate",
  normalizeRoomCodeParam,
  roomController.generateQuestions,
) 

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  let currentRoom = null;
  let currentRole = null;
  let currentPlayerId = null;

  socket.on("join-game", async ({ roomCode, role, playerId }) => {
    currentRoom = roomCode;
    currentRole = role;
    currentPlayerId = playerId;

    if (role === "host") {
      socket.join(`room:${roomCode}`);
      socket.join(`host:${roomCode}`);

      let game = quizService.getGame(roomCode);
      if (!game) {
        const room = await roomService.getRoomRaw(roomCode);
        if (room) {
          quizService.initGame(room);
          game = quizService.getGame(roomCode);
          if (game) quizService.startGame(roomCode, io);
        }
      } else {
        const state = quizService.getGameState(roomCode);
        if (state) {
          if (state.hostData) socket.emit("host-question", state.hostData);
          if (state.scores) socket.emit("scores", { scores: state.scores });
          if (state.phase) socket.emit("phase-change", { phase: state.phase });
          if (state.podium) socket.emit("podium", state.podium);
          if (state.finalScores) {
            socket.emit("game-ended", {
              finalScores: state.finalScores,
              winner: state.winner,
            });
          }
          if (state.questionData) socket.emit("question", state.questionData);
          socket.emit("pause", { paused: Boolean(state.paused) });
        }
      }
    } else if (role === "audience") {
      socket.join(`room:${roomCode}`);
      socket.join(`player:${playerId}`);
      socket.emit("joined", { roomCode, playerId });

      const state = quizService.getGameState(roomCode);
      if (state) {
        if (state.questionData) socket.emit("question", state.questionData);
        if (state.scores) socket.emit("scores", { scores: state.scores });
        if (state.phase) socket.emit("phase-change", { phase: state.phase });
        if (state.podium) socket.emit("podium", state.podium);
        if (state.finalScores) {
          socket.emit("game-ended", {
            finalScores: state.finalScores,
            winner: state.winner,
          });
        }
        socket.emit("pause", { paused: Boolean(state.paused) });
      }
    }
  });

  socket.on("skip-question", ({ roomCode }) => {
    if (currentRole !== "host" || !socket.rooms.has(`room:${roomCode}`)) {
      socket.emit("error", { message: "Only the host can control the game" });
      return;
    }
    const result = quizService.skipQuestion(roomCode, io);
    if (result && result.error) {
      socket.emit("error", { message: result.error });
    }
  });

  socket.on("pause-game", ({ roomCode }) => {
    if (currentRole !== "host" || !socket.rooms.has(`room:${roomCode}`)) {
      socket.emit("error", { message: "Only the host can control the game" });
      return;
    }
    const result = quizService.pauseGame(roomCode, io);
    if (result && result.error) {
      socket.emit("error", { message: result.error });
    }
  });

  socket.on("resume-game", ({ roomCode }) => {
    if (currentRole !== "host" || !socket.rooms.has(`room:${roomCode}`)) {
      socket.emit("error", { message: "Only the host can control the game" });
      return;
    }
    const result = quizService.resumeGame(roomCode, io);
    if (result && result.error) {
      socket.emit("error", { message: result.error });
    }
  });

  socket.on("submit-answer", ({ roomCode, playerId, answer }) => {
    const result = quizService.submitAnswer(roomCode, playerId, answer, io);
    if (result.error) {
      socket.emit("error", { message: result.error });
    }
  });

  socket.on("disconnect", () => {
  });
});

server.listen(PORT, () => {
  console.log(`QuizGame backend listening on port ${PORT}`);
});
