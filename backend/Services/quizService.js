const { info } = require("../Utils/logger");

const SERVICE = "quizService";

const rooms = new Map();

const activeGames = new Map();

function calculateScore(correct, timeTakenMs, maxTimeMs) {
  if (!correct) return 0;
  const base = 100;
  const speedRatio = Math.max(0, 1 - (timeTakenMs / maxTimeMs));
  const speedBonus = Math.round(speedRatio * 50);
  return base + speedBonus;
}

function initGame(room) {
  if (activeGames.has(room.code)) return activeGames.get(room.code);

  const game = {
    roomCode: room.code,
    currentQuestionIndex: -1,
    totalQuestions: room.questions.length,
    questions: room.questions,
    scores: new Map(),
    phase: 'idle',
    questionTimer: null,
    podiumTimer: null,
    questionStartTime: 0,
    questionTimeLimit: 30000,
    questionEndAt: 0,
    paused: false,
    pauseRemainingMs: 0,
    answersForCurrent: new Map(),
    answeredCount: 0,
    lastQuestionData: null,
    lastHostData: null,
    lastScores: [],
    lastPhase: 'idle',
  };

  room.players.forEach((p) => {
    game.scores.set(p.id, {
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      number: p.number,
      score: 0,
      correctCount: 0,
      totalPossible: 0,
    });
  });

  activeGames.set(room.code, game);
  return game;
}

function getGame(roomCode) {
  return activeGames.get(roomCode) || null;
}

function startGame(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return null;
  game.phase = 'playing';
  nextQuestion(roomCode, io);
  return game;
}

function nextQuestion(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return;

  game.currentQuestionIndex++;
  game.answersForCurrent = new Map();
  game.answeredCount = 0;
  game.questionStartTime = Date.now();

  if (game.currentQuestionIndex >= game.totalQuestions) {
    endGame(roomCode, io);
    return;
  }

  const q = game.questions[game.currentQuestionIndex];
  game.questionTimeLimit = (q.timer || 30) * 1000;
  game.phase = 'question';
  game.lastPhase = 'question';

  const questionData = {
    questionIndex: game.currentQuestionIndex,
    totalQuestions: game.totalQuestions,
    question: q.question,
    options: q.options,
    category: q.category,
    timer: Math.floor(game.questionTimeLimit / 1000),
  };
  game.lastQuestionData = questionData;

  const hostData = { ...questionData, correctAnswer: q.answer };
  game.lastHostData = hostData;

  io.to(`room:${roomCode}`).emit('question', questionData);
  io.to(`room:${roomCode}`).emit('phase-change', { phase: 'question' });
  io.to(`host:${roomCode}`).emit('host-question', hostData);

  emitScores(roomCode, io);

  game.paused = false;
  game.pauseRemainingMs = 0;
  armQuestionTimer(roomCode, io, game.questionTimeLimit + 1000);
}

// Arm (or re-arm) the question timer so it fires in `delayMs`.
function armQuestionTimer(roomCode, io, delayMs) {
  const game = activeGames.get(roomCode);
  if (!game) return;
  if (game.questionTimer) clearTimeout(game.questionTimer);
  game.questionEndAt = Date.now() + delayMs;
  game.questionTimer = setTimeout(() => {
    endQuestionPhase(roomCode, io);
  }, delayMs);
}

function pauseGame(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return { error: 'Game not found' };
  if (game.phase !== 'question') return { error: 'Can only pause during a question' };
  if (game.paused) return { error: 'Game is already paused' };

  if (game.questionTimer) clearTimeout(game.questionTimer);
  game.paused = true;
  game.pauseRemainingMs = Math.max(0, game.questionEndAt - Date.now());
  game.questionTimer = null;

  io.to(`room:${roomCode}`).emit('pause', { paused: true });
  info(SERVICE, 'Game paused', { roomCode, remainingMs: game.pauseRemainingMs });
  return { success: true };
}

function resumeGame(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return { error: 'Game not found' };
  if (game.phase !== 'question') return { error: 'Can only resume during a question' };
  if (!game.paused) return { error: 'Game is not paused' };

  const delay = Math.max(1, game.pauseRemainingMs);
  game.paused = false;
  game.pauseRemainingMs = 0;
  armQuestionTimer(roomCode, io, delay);

  io.to(`room:${roomCode}`).emit('pause', { paused: false });
  info(SERVICE, 'Game resumed', { roomCode, remainingMs: delay });
  return { success: true };
}

function skipQuestion(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return { error: 'Game not found' };
  if (game.phase === 'finished') return { error: 'Game already finished' };

  if (game.phase === 'question') {
    if (game.questionTimer) clearTimeout(game.questionTimer);
    game.questionTimer = null;
    game.paused = false;
    endQuestionPhase(roomCode, io);
  } else if (game.phase === 'podium') {
    if (game.podiumTimer) clearTimeout(game.podiumTimer);
    game.podiumTimer = null;
    nextQuestion(roomCode, io);
  }

  info(SERVICE, 'Skipped by host', { roomCode, phase: game.phase });
  return { success: true };
}

function submitAnswer(roomCode, playerId, answer, io) {
  const game = activeGames.get(roomCode);
  if (!game || game.phase !== 'question') return { error: 'Not in question phase' };

  if (game.answersForCurrent.has(playerId)) {
    return { error: 'Already answered' };
  }

  const timeTaken = Date.now() - game.questionStartTime;
  const q = game.questions[game.currentQuestionIndex];
  const correct = answer === q.answer;
  const scoreGained = calculateScore(correct, Math.min(timeTaken, game.questionTimeLimit), game.questionTimeLimit);

  const playerScore = game.scores.get(playerId);
  if (!playerScore) return { error: 'Player not found' };

  playerScore.score += scoreGained;
  if (correct) playerScore.correctCount++;
  playerScore.totalPossible += 100;

  game.answersForCurrent.set(playerId, {
    answer,
    correct,
    timeTaken,
    scoreGained,
  });
  game.answeredCount++;

  const result = {
    correct,
    correctAnswer: q.answer,
    scoreGained,
    totalScore: playerScore.score,
    timeTaken,
  };

  io.to(`player:${playerId}`).emit('answer-result', result);
  emitScores(roomCode, io);

  const allPlayers = game.scores.size;
  if (game.answeredCount >= allPlayers) {
    if (game.questionTimer) clearTimeout(game.questionTimer);
    setTimeout(() => endQuestionPhase(roomCode, io), 500);
  }

  return { success: true };
}

function endQuestionPhase(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game || game.phase === 'podium') return;

  const q = game.questions[game.currentQuestionIndex];

  const stats = {
    correctAnswer: q.answer,
    totalAnswered: game.answeredCount,
    totalPlayers: game.scores.size,
    distribution: q.options.map((_, i) => {
      let count = 0;
      game.answersForCurrent.forEach((a) => {
        if (a.answer === i) count++;
      });
      return count;
    }),
  };

  io.to(`room:${roomCode}`).emit('question-ended', stats);
  showPodium(roomCode, io);
}

function showPodium(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return;

  game.phase = 'podium';
  game.lastPhase = 'podium';
  io.to(`room:${roomCode}`).emit('phase-change', { phase: 'podium' });

  const sorted = Array.from(game.scores.values()).sort((a, b) => b.score - a.score);
  const top5 = sorted.slice(0, 5).map((p, i) => ({
    rank: i + 1,
    ...p,
    gapFromLeader: i === 0 ? 0 : sorted[0].score - p.score,
  }));

  game.lastPodium = { top5, scores: sorted };

  io.to(`room:${roomCode}`).emit('podium', { top5, scores: sorted });

  if (game.podiumTimer) clearTimeout(game.podiumTimer);
  game.podiumTimer = setTimeout(() => {
    nextQuestion(roomCode, io);
  }, 10000);
}

function endGame(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return;

  game.phase = 'finished';
  game.lastPhase = 'finished';
  if (game.questionTimer) clearTimeout(game.questionTimer);
  if (game.podiumTimer) clearTimeout(game.podiumTimer);

  const sorted = Array.from(game.scores.values()).sort((a, b) => b.score - a.score);
  const finalScores = sorted.map((p, i) => ({
    rank: i + 1,
    ...p,
    gapFromLeader: i === 0 ? 0 : sorted[0].score - p.score,
  }));

  game.lastFinalScores = finalScores;
  game.lastWinner = finalScores[0] || null;

  io.to(`room:${roomCode}`).emit('game-ended', { finalScores, winner: game.lastWinner });
  io.to(`room:${roomCode}`).emit('phase-change', { phase: 'finished' });
}

function emitScores(roomCode, io) {
  const game = activeGames.get(roomCode);
  if (!game) return;

  const sorted = Array.from(game.scores.values()).sort((a, b) => b.score - a.score);
  const scores = sorted.map((p, i) => ({
    rank: i + 1,
    ...p,
    gapFromLeader: i === 0 ? 0 : sorted[0].score - p.score,
  }));

  game.lastScores = scores;
  io.to(`room:${roomCode}`).emit('scores', { scores });
}

function getGameState(roomCode) {
  const game = activeGames.get(roomCode);
  if (!game) return null;
  return {
    phase: game.lastPhase,
    questionData: game.lastQuestionData,
    hostData: game.lastHostData,
    scores: game.lastScores,
    podium: game.lastPodium,
    finalScores: game.lastFinalScores,
    winner: game.lastWinner,
    paused: game.paused,
  };
}

module.exports = {
  calculateScore,
  initGame,
  getGame,
  startGame,
  nextQuestion,
  submitAnswer,
  pauseGame,
  resumeGame,
  skipQuestion,
  endQuestionPhase,
  showPodium,
  endGame,
  emitScores,
  getGameState,
};
