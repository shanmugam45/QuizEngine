// ── Room controller ───────────────────────────────────────────────────────────
// Translates HTTP requests into calls to roomService, then sends back JSON.
// Each handler delegates errors to Express's next() for the global error handler.

const roomService = require("../Services/roomService");

// POST /api/rooms — create a new room from the request body.
async function createRoom(req, res, next) {
  try {
    const room = await roomService.createRoom(req.body);
    return res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/rooms — return every room that currently exists.
async function listRooms(req, res, next) {
  try {
    const rooms = await roomService.listRooms();
    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/rooms/:roomCode — fetch a single room by its code.
async function getRoom(req, res, next) {
  try {
    const room = await roomService.getRoomByCode(req.params.roomCode);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/rooms/:roomCode/join — add a player to the room.
async function joinRoom(req, res, next) {
  try {
    const result = await roomService.joinRoom({
      code: req.params.roomCode,
      playerName: req.body.playerName,
      avatar: req.body.avatar,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/rooms/:roomCode/start — transition the room from lobby to live.
async function startRoom(req, res, next) {
  try {
    const room = await roomService.startRoom(req.params.roomCode);

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/rooms/:roomCode/generate — generate questions from the room's deck/audience.
async function generateQuestions(req, res, next) {
  try {
    const room = await roomService.generateRoomQuestions(req.params.roomCode);
    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRoom,
  listRooms,
  getRoom,
  joinRoom,
  startRoom,
  generateQuestions,
};
