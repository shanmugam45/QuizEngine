// ── Room service ──────────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");

const Room = require("../Models/Room");
const { generateQuestions } = require("./aiService");

const rooms = new Map();
const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "rooms.json");

// Load any previously saved rooms at startup.
function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (Array.isArray(parsed)) {
        parsed.forEach((raw) => {
          const room = new Room(raw);
          Object.assign(room, raw);
          rooms.set(room.code, room);
        });
      }
    }
  } catch (err) {
    console.warn("Could not load rooms.json, starting with an empty store:", err.message);
  }
}

// Write all rooms to disk so they survive a server restart.
function persist() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(Array.from(rooms.values()).map((r) => r.toJSON()), null, 2),
    );
  } catch (err) {
    console.warn("Could not persist rooms.json:", err.message);
  }
}

loadFromDisk();

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateRoomCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

function createUniqueRoomCode() {
  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }
  return code;
}

function sanitize(value) {
  return String(value || "").trim();
}

// ── Public API ────────────────────────────────────────────────────────────────

async function createRoom({ title, topic, numQuestions, difficulty, hostName }) {
  const code = createUniqueRoomCode();
  const room = new Room({
    code,
    title: sanitize(title),
    topic: sanitize(topic),
    numQuestions: Math.max(1, parseInt(numQuestions, 10) || 5),
    difficulty: sanitize(difficulty) || "medium",
    hostName: sanitize(hostName),
  });

  room.questions = await generateQuestions({
    topic: room.topic,
    numQuestions: room.numQuestions,
    difficulty: room.difficulty,
  });

  rooms.set(code, room);
  persist();
  return room.toJSON();
}

function getRoomByCode(code) {
  const room = rooms.get(code);
  return room ? room.toJSON() : null;
}

function getRoomRaw(code) {
  return rooms.get(code) || null;
}

function listRooms() {
  return Array.from(rooms.values()).map((r) => r.toJSON());
}

function joinRoom({ code, playerName, avatar }) {
  const room = rooms.get(code);
  if (!room) {
    const err = new Error("Room not found");
    err.status = 404;
    throw err;
  }
  if (room.status !== "lobby") {
    const err = new Error("Room is already live");
    err.status = 400;
    throw err;
  }

  const cleanName = sanitize(playerName);
  const existing = room.players.find(
    (p) => p.name.toLowerCase() === cleanName.toLowerCase(),
  );
  if (existing) {
    return { room: room.toJSON(), player: existing };
  }

  const player = {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: cleanName,
    avatar: avatar || 0,
    joinedAt: new Date().toISOString(),
  };
  room.players.push(player);
  room.touch();
  persist();
  return { room: room.toJSON(), player };
}

function startRoom(code) {
  const room = rooms.get(code);
  if (!room) {
    const err = new Error("Room not found");
    err.status = 404;
    throw err;
  }
  room.status = "live";
  room.players.forEach((p, i) => {
    p.number = i + 1;
  });
  room.touch();
  persist();
  return room.toJSON();
}

async function generateRoomQuestions(code) {
  const room = rooms.get(code);
  if (!room) {
    const err = new Error("Room not found");
    err.status = 404;
    throw err;
  }

  room.questions = await generateQuestions({
    topic: room.topic,
    numQuestions: room.numQuestions,
    difficulty: room.difficulty,
  });

  room.touch();
  persist();
  return room.toJSON();
}

module.exports = {
  createRoom,
  getRoomByCode,
  getRoomRaw,
  listRooms,
  joinRoom,
  startRoom,
  generateRoomQuestions,
};
