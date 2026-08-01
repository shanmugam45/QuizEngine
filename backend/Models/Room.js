// ── Room model ────────────────────────────────────────────────────────────────

class Room {
  constructor({ code, title, topic, numQuestions, difficulty, hostName }) {
    this.code = code;
    this.title = title || "";
    this.topic = topic || "";
    this.numQuestions = numQuestions || 5;
    this.difficulty = difficulty || "medium";
    this.hostName = hostName;
    this.questions = [];
    this.status = "lobby";
    this.players = [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      code: this.code,
      title: this.title,
      topic: this.topic,
      numQuestions: this.numQuestions,
      difficulty: this.difficulty,
      hostName: this.hostName,
      questions: this.questions,
      status: this.status,
      players: this.players,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Room;
