import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import '../styles/AudienceQuiz.css'
import { SOCKET_URL } from '../api'

interface PlayerScore {
  id: string
  name: string
  avatar: number
  score: number
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
}

function AudienceQuiz() {
  const params = new URLSearchParams(window.location.search)
  const roomCode = params.get('code') || ''
  const playerId = params.get('playerId') || ''

  const socketRef = useRef<Socket | null>(null)
  const [phase, setPhase] = useState<'question' | 'podium' | 'finished'>('question')
  const [question, setQuestion] = useState<QuestionData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; scoreGained: number; totalScore: number; correctAnswer: number } | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [scores, setScores] = useState<PlayerScore[]>([])
  const [myScore, setMyScore] = useState(0)
  const [myRank, setMyRank] = useState(0)
  const [top5, setTop5] = useState<PlayerScore[]>([])
  const [podiumCountdown, setPodiumCountdown] = useState(10)
  const [finalScores, setFinalScores] = useState<PlayerScore[]>([])
  const [winner, setWinner] = useState<PlayerScore | null>(null)
  const [gapFromLeader, setGapFromLeader] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socketRef.current = socket

    socket.emit('join-game', { roomCode, role: 'audience', playerId })

    socket.on('question', (data: QuestionData) => {
      setQuestion(data)
      setTimeLeft(data.timer)
      setSelectedAnswer(null)
      setAnswerResult(null)
      setHasAnswered(false)
      setPaused(false)
      setPhase('question')
    })

    socket.on('pause', ({ paused: isPaused }) => {
      setPaused(isPaused)
    })

    socket.on('phase-change', ({ phase: newPhase }) => {
      setPhase(newPhase)
      if (newPhase === 'podium') {
        setPodiumCountdown(10)
      }
    })

    socket.on('answer-result', (result) => {
      setAnswerResult(result)
      setHasAnswered(true)
      setMyScore(result.totalScore)
    })

    socket.on('scores', ({ scores: newScores }) => {
      setScores(newScores)
      const me = newScores.find((s: PlayerScore) => s.id === playerId)
      if (me) {
        setMyScore(me.score)
        setMyRank(me.rank)
        setGapFromLeader(me.gapFromLeader)
      }
    })

    socket.on('podium', ({ top5: topFive }) => {
      setTop5(topFive)
    })

    socket.on('question-ended', () => {
    })

    socket.on('game-ended', ({ finalScores: fs, winner: w }) => {
      setFinalScores(fs)
      setWinner(w)
      setPhase('finished')
    })

    return () => { socket.close() }
  }, [roomCode, playerId])

  useEffect(() => {
    if (phase !== 'question' || !question || paused) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, question, paused])

  useEffect(() => {
    if (phase !== 'podium') return
    const interval = setInterval(() => {
      setPodiumCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  const submitAnswer = (answerIndex: number) => {
    if (hasAnswered || paused || !socketRef.current) return
    setSelectedAnswer(answerIndex)
    setHasAnswered(true)

    socketRef.current.emit('submit-answer', {
      roomCode,
      playerId,
      answer: answerIndex,
    })
  }

  const goHome = () => { window.location.href = '/' }

  if (phase === 'finished') {
    return (
      <main className="aq-page">
        <div className="aq-header">
          <h1>Quiz Over!</h1>
        </div>

        {winner && (
          <div className="aq-winner sketch-card">
            <span className="aq-winner-trophy">&#9733;</span>
            <span className="aq-winner-name">{winner.name}</span>
            <span className="aq-winner-score">{winner.score} pts</span>
          </div>
        )}

        {myRank > 0 && (
          <div className="aq-my-result sketch-card">
            <span>You finished #{myRank} with <strong>{myScore} pts</strong></span>
          </div>
        )}

        <section className="aq-final-scores">
          <p className="aq-section-title">Final Scores</p>
          <div className="aq-score-list">
            {finalScores.map((p) => (
              <div key={p.id} className={`aq-score-row sketch-card ${p.id === playerId ? 'is-me' : ''} ${p.rank <= 3 ? 'is-top' : ''}`}>
                <span className="aq-rank">#{p.rank}</span>
                <span className="aq-avatar-badge">{'•~*+#' [p.avatar] || '?'}</span>
                <span className="aq-pname">{p.id === playerId ? 'You' : p.name}</span>
                <span className="aq-pscore">{p.score}</span>
                {p.gapFromLeader > 0 && (
                  <span className="aq-gap">-{p.gapFromLeader}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <button className="aq-primary-btn" onClick={goHome}>Back to Home</button>
      </main>
    )
  }

  if (phase === 'podium') {
    return (
      <main className="aq-page">
        <div className="aq-header">
          <p className="aq-eyebrow">Leaderboard</p>
          <h1>Top 5</h1>
          <p className="aq-podium-timer">Next question in {podiumCountdown}s</p>
        </div>

        {myRank > 0 && !top5.find((p) => p.id === playerId) && (
          <div className="aq-my-rank sketch-card">
            <span>You're #{myRank} — {myScore} pts</span>
            {gapFromLeader > 0 && <span className="aq-gap">(-{gapFromLeader})</span>}
          </div>
        )}

        <section className="aq-podium">
          {top5.map((p, i) => (
            <div key={p.id} className={`aq-podium-card sketch-card ${i === 0 ? 'is-gold' : i === 1 ? 'is-silver' : i === 2 ? 'is-bronze' : ''} ${p.id === playerId ? 'is-me' : ''}`}>
              <span className="aq-podium-rank">#{p.rank}</span>
              <span className="aq-avatar-badge">{'•~*+#' [p.avatar] || '?'}</span>
              <span className="aq-podium-name">{p.id === playerId ? 'You' : p.name}</span>
              <span className="aq-podium-score">{p.score} pts</span>
              {p.gapFromLeader > 0 && (
                <span className="aq-gap">-{p.gapFromLeader}</span>
              )}
            </div>
          ))}
        </section>

        {scores.length > 5 && (
          <section className="aq-rest-scores">
            <p className="aq-section-title">Others</p>
            {scores.slice(5).map((p) => (
              <div key={p.id} className={`aq-score-row sketch-card ${p.id === playerId ? 'is-me' : ''}`}>
                <span className="aq-rank">#{p.rank}</span>
                <span className="aq-avatar-badge">{'•~*+#' [p.avatar] || '?'}</span>
                <span className="aq-pname">{p.id === playerId ? 'You' : p.name}</span>
                <span className="aq-pscore">{p.score}</span>
                <span className="aq-gap">-{p.gapFromLeader}</span>
              </div>
            ))}
          </section>
        )}
      </main>
    )
  }

  return (
    <main className="aq-page">
      <div className="aq-header">
        <p className="aq-eyebrow">
          Q{question ? question.questionIndex + 1 : '-'} / {question ? question.totalQuestions : '-'}
          <span className="aq-category">{question?.category}</span>
        </p>
        <h1 className="aq-timer">{paused ? 'Paused' : `${timeLeft}s`}</h1>
      </div>

      {paused && (
        <div className="aq-paused-banner">
          The host paused the game. Hang tight!
        </div>
      )}

      <div className="aq-my-stats sketch-card">
        <span>Rank: #{myRank}</span>
        <span>Score: {myScore}</span>
        {gapFromLeader > 0 && <span className="aq-gap">Behind by {gapFromLeader}</span>}
      </div>

      {question && (
        <section className="aq-question-card sketch-card">
          <p className="aq-question-text">{question.question}</p>
          <div className="aq-options">
            {question.options.map((opt, i) => {
              let cls = 'aq-option'
              if (hasAnswered && selectedAnswer === i) {
                cls += ' is-selected'
                if (answerResult) {
                  cls += answerResult.correct ? ' is-correct' : ' is-wrong'
                }
              }
              if (hasAnswered && answerResult && i === answerResult.correctAnswer) {
                cls += ' is-correct'
              }
              if (!hasAnswered && timeLeft === 0) {
              }
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => submitAnswer(i)}
                  disabled={hasAnswered || timeLeft === 0 || paused}
                >
                  <span className="aq-opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {hasAnswered && answerResult && (
        <div className={`aq-result-banner ${answerResult.correct ? 'is-correct' : 'is-wrong'}`}>
          {answerResult.correct
            ? `Correct! +${answerResult.scoreGained} pts`
            : `Wrong! Answer was: ${question ? question.options[answerResult.correctAnswer] : ''}`
          }
        </div>
      )}
    </main>
  )
}

export default AudienceQuiz
