import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import '../styles/HostQuiz.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SOCKET_URL = API.replace('/api', '')

interface PlayerScore {
  id: string
  name: string
  avatar: number
  number: number
  score: number
  correctCount: number
  rank: number
  gapFromLeader: number
}

interface QuestionData {
  questionIndex: number
  totalQuestions: number
  question: string
  options: string[]
  category: string
  timer: number
  correctAnswer: number
}

function HostQuiz() {
  const params = new URLSearchParams(window.location.search)
  const roomCode = params.get('code') || ''

  const socketRef = useRef<Socket | null>(null)
  const [phase, setPhase] = useState<'question' | 'podium' | 'finished'>('question')
  const [question, setQuestion] = useState<QuestionData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [scores, setScores] = useState<PlayerScore[]>([])
  const [top5, setTop5] = useState<PlayerScore[]>([])
  const [podiumCountdown, setPodiumCountdown] = useState(10)
  const [finalScores, setFinalScores] = useState<PlayerScore[]>([])
  const [winner, setWinner] = useState<PlayerScore | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [totalPlayers, setTotalPlayers] = useState(0)

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socketRef.current = socket

    socket.emit('join-game', { roomCode, role: 'host' })

    socket.on('host-question', (data: QuestionData) => {
      setQuestion(data)
      setTimeLeft(data.timer)
      setCorrectAnswer(data.correctAnswer)
      setAnsweredCount(0)
      setPhase('question')
    })

    socket.on('phase-change', ({ phase: newPhase }) => {
      setPhase(newPhase)
      if (newPhase === 'podium') {
        setPodiumCountdown(10)
      }
    })

    socket.on('scores', ({ scores: newScores }) => {
      setScores(newScores)
      const answered = newScores.filter((s: PlayerScore) => s.correctCount > 0 || s.score > 0).length
      setAnsweredCount(answered)
      if (newScores.length > 0) setTotalPlayers(newScores.length)
    })

    socket.on('podium', ({ top5: topFive }) => {
      setTop5(topFive)
    })

    socket.on('question-ended', ({ totalAnswered, totalPlayers: tP }) => {
      setAnsweredCount(totalAnswered)
      setTotalPlayers(tP)
    })

    socket.on('game-ended', ({ finalScores: fs, winner: w }) => {
      setFinalScores(fs)
      setWinner(w)
      setPhase('finished')
    })

    return () => { socket.close() }
  }, [roomCode])

  useEffect(() => {
    if (phase !== 'question' || !question) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, question])

  useEffect(() => {
    if (phase !== 'podium') return
    const interval = setInterval(() => {
      setPodiumCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  const goHome = () => { window.location.href = '/' }

  if (phase === 'finished') {
    return (
      <main className="hq-page">
        <div className="hq-header">
          <h1>Quiz Over!</h1>
          <p className="hq-eyebrow">Room {roomCode}</p>
        </div>

        {winner && (
          <div className="hq-winner sketch-card">
            <span className="hq-winner-trophy">&#9733;</span>
            <span className="hq-winner-name">{winner.name}</span>
            <span className="hq-winner-score">{winner.score} pts</span>
          </div>
        )}

        <section className="hq-final-scores">
          <p className="hq-section-title">Final Scores</p>
          <div className="hq-score-list">
            {finalScores.map((p) => (
              <div key={p.id} className={`hq-score-row sketch-card ${p.rank <= 3 ? 'is-top' : ''}`}>
                <span className="hq-rank">#{p.rank}</span>
                <span className="hq-avatar-badge">{'•~*+#' [p.avatar] || '?'}</span>
                <span className="hq-pname">{p.name}</span>
                <span className="hq-pscore">{p.score}</span>
                {p.gapFromLeader > 0 && (
                  <span className="hq-gap">-{p.gapFromLeader}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <button className="hq-primary-btn" onClick={goHome}>Back to Home</button>
      </main>
    )
  }

  if (phase === 'podium') {
    return (
      <main className="hq-page">
        <div className="hq-header">
          <p className="hq-eyebrow">Leaderboard</p>
          <h1>Top 5</h1>
          <p className="hq-podium-timer">Next question in {podiumCountdown}s</p>
        </div>

        <section className="hq-podium">
          {top5.map((p, i) => (
            <div key={p.id} className={`hq-podium-card sketch-card ${i === 0 ? 'is-gold' : i === 1 ? 'is-silver' : i === 2 ? 'is-bronze' : ''}`}>
              <span className="hq-podium-rank">#{p.rank}</span>
              <span className="hq-avatar-badge">{'•~*+#' [p.avatar] || '?'}</span>
              <span className="hq-podium-name">{p.name}</span>
              <span className="hq-podium-score">{p.score} pts</span>
              {p.gapFromLeader > 0 && (
                <span className="hq-gap">-{p.gapFromLeader}</span>
              )}
            </div>
          ))}
        </section>

        {scores.length > 5 && (
          <section className="hq-rest-scores">
            <p className="hq-section-title">Others</p>
            {scores.slice(5).map((p) => (
              <div key={p.id} className="hq-score-row sketch-card">
                <span className="hq-rank">#{p.rank}</span>
                <span className="hq-avatar-badge">{'•~*+#' [p.avatar] || '?'}</span>
                <span className="hq-pname">{p.name}</span>
                <span className="hq-pscore">{p.score}</span>
                <span className="hq-gap">-{p.gapFromLeader}</span>
              </div>
            ))}
          </section>
        )}
      </main>
    )
  }

  return (
    <main className="hq-page">
      <div className="hq-header">
        <p className="hq-eyebrow">
          Q{question ? question.questionIndex + 1 : '-'} / {question ? question.totalQuestions : '-'}
          <span className="hq-category">{question?.category}</span>
        </p>
        <h1 className="hq-timer">{timeLeft}s</h1>
        <p className="hq-answered">
          {answeredCount} / {totalPlayers} answered
        </p>
      </div>

      {question && (
        <section className="hq-question-card sketch-card">
          <p className="hq-question-text">{question.question}</p>
          <div className="hq-options">
            {question.options.map((opt, i) => {
              let cls = 'hq-option'
              if (correctAnswer !== null) {
                if (i === correctAnswer) cls += ' is-correct'
              }
              return (
                <div key={i} className={cls}>
                  <span className="hq-opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="hq-scoreboard">
        <p className="hq-section-title">Live Scores</p>
        <div className="hq-score-list">
          {scores.map((p) => (
            <div key={p.id} className={`hq-score-row sketch-card ${p.rank <= 3 ? 'is-top' : ''}`}>
              <span className="hq-rank">#{p.rank}</span>
              <span className="hq-avatar-badge">{'•~*+#' [p.avatar] || '?'}</span>
              <span className="hq-pname">{p.name}</span>
              <span className="hq-pscore">{p.score}</span>
              {p.gapFromLeader > 0 && (
                <span className="hq-gap">-{p.gapFromLeader}</span>
              )}
            </div>
          ))}
          {scores.length === 0 && (
            <p className="hq-no-scores">Waiting for players...</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default HostQuiz
