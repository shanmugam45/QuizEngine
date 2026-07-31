import { useState, useEffect, useCallback } from 'react'
import '../styles/CreateRoom.css'
import { StudentLoader } from '../components/StudentMascots'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const difficulties = [
  { value: 'easy', label: 'Easy', desc: 'Slow timer, simple picks' },
  { value: 'medium', label: 'Medium', desc: 'Balanced pace' },
  { value: 'hard', label: 'Hard', desc: 'Fast timer, tough calls' },
]

interface Question {
  id: string
  question: string
  options: string[]
  answer: number
  category: string
  round: number
  timer: number
}

interface Player {
  id: string
  name: string
  avatar: number
  number?: number
}

type Step = 'form' | 'preview' | 'waiting'

function CreateRoom() {
  const [step, setStep] = useState<Step>('form')

  // Form state
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [hostName, setHostName] = useState('')
  const [error, setError] = useState('')

  // Generation
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [roomCode, setRoomCode] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [starting, setStarting] = useState(false)

  const fetchPlayers = useCallback(async () => {
    if (!roomCode) return
    try {
      const res = await fetch(`${API}/rooms/${roomCode}`)
      const data = await res.json()
      if (data.success) {
        setPlayers(data.data.players || [])
      }
    } catch {
      // ignore polling errors
    }
  }, [roomCode])

  // Poll for new players while in waiting step
  useEffect(() => {
    if (step !== 'waiting' || !roomCode) return
    fetchPlayers()
    const id = setInterval(fetchPlayers, 3000)
    return () => clearInterval(id)
  }, [step, roomCode, fetchPlayers])

  const createAndGenerate = async () => {
    setError('')
    if (!title.trim() || !topic.trim() || !hostName.trim()) {
      setError('Fill in all fields')
      return
    }
    setGenerating(true)
    try {
      const res = await fetch(`${API}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          topic: topic.trim(),
          numQuestions,
          difficulty,
          hostName: hostName.trim(),
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Failed to create room')
        return
      }
      setQuestions(data.data.questions || [])
      setRoomCode(data.data.code)
      setPlayers(data.data.players || [])
      setStep('preview')
    } catch {
      setError('Cannot reach server')
    } finally {
      setGenerating(false)
    }
  }

  const regenerate = async () => {
    if (!roomCode) return
    setGenerating(true)
    try {
      const res = await fetch(`${API}/rooms/${roomCode}/generate`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setQuestions(data.data.questions || [])
      }
    } catch {
      setError('Failed to regenerate')
    } finally {
      setGenerating(false)
    }
  }

  const startRoom = async () => {
    if (!roomCode) return
    setStarting(true)
    try {
      const res = await fetch(`${API}/rooms/${roomCode}/start`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        window.location.href = `/host-quiz?code=${roomCode}`
        return
      }
    } catch {
      setError('Failed to start room')
    } finally {
      setStarting(false)
    }
  }

  // ── Form step ──────────────────────────────────────────────
  if (step === 'form') {
    return (
      <main className="cr-page">
        <button type="button" className="cr-back" onClick={() => window.location.href = '/'}>&larr; Back</button>
        <header className="cr-header">
          <p className="cr-eyebrow">Host a competition</p>
          <h1>Set up your quiz room</h1>
        </header>

        <section className="cr-card sketch-card">
          <div className="cr-fields">
            <label className="cr-field">
              <span>Room title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Friday Night Quiz" />
            </label>

            <label className="cr-field">
              <span>Topic for questions</span>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Science and pop culture trivia"
                rows={2}
              />
            </label>

            <div className="cr-row">
              <label className="cr-field cr-field-sm">
                <span>Number of questions</span>
                <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </label>

              <label className="cr-field cr-field-sm">
                <span>Your name</span>
                <input value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="Host name" />
              </label>
            </div>

            <div className="cr-difficulty">
              <span>Difficulty</span>
              <div className="cr-difficulty-options">
                {difficulties.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    className={`cr-diff-btn ${difficulty === d.value ? 'is-active' : ''}`}
                    onClick={() => setDifficulty(d.value)}
                  >
                    <strong>{d.label}</strong>
                    <span>{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="cr-error">{error}</p>}

          <button type="button" className="cr-primary-btn" onClick={createAndGenerate} disabled={generating}>
            {generating && <StudentLoader variant="sam" size={18} title="Generating questions" style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            {generating ? 'Generating...' : 'Generate questions'}
          </button>
        </section>

        <p className="cr-footnote">Questions are generated based on your topic and difficulty.</p>
      </main>
    )
  }

  // ── Preview step (host only — no room code, no audience) ───
  if (step === 'preview') {
    return (
      <main className="cr-page">
        <button type="button" className="cr-back" onClick={() => window.location.href = '/'}>&larr; Back</button>
        <header className="cr-header">
          <p className="cr-eyebrow">Preview — only you see this</p>
          <h1>Review questions</h1>
        </header>

        <section className="cr-preview-grid">
          {questions.map((q) => (
            <article key={q.id} className="cr-qcard sketch-card">
              <div className="cr-qcard-head">
                <span className="cr-qnum">Q{q.round}</span>
                <span className="cr-qcat">{q.category}</span>
              </div>
              <p className="cr-qtext">{q.question}</p>
              <div className="cr-qopts">
                {q.options.map((opt, oi) => {
                  const cls = oi === q.answer ? 'cr-opt is-answer' : 'cr-opt'
                  return (
                    <div key={oi} className={cls}>
                      <span className="cr-opt-letter">{String.fromCharCode(65 + oi)}</span>
                      <span>{opt}</span>
                    </div>
                  )
                })}
              </div>
              <span className="cr-qtimer">{q.timer}s per question</span>
            </article>
          ))}
        </section>

        <div className="cr-preview-actions">
          <button type="button" className="cr-secondary-btn" onClick={regenerate} disabled={generating}>
            {generating && <StudentLoader variant="sam" size={18} title="Regenerating questions" style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            {generating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button type="button" className="cr-primary-btn" onClick={() => setStep('waiting')}>
            Share room with audience
          </button>
        </div>
      </main>
    )
  }

  // ── Waiting step (room code + players, NO questions) ───────
  return (
    <main className="cr-page">
      <button type="button" className="cr-back" onClick={() => window.location.href = '/'}>&larr; Back</button>

      <header className="cr-header">
        <p className="cr-eyebrow">Room is open</p>
        <h1>{title}</h1>
      </header>

      <div className="cr-code-badge sketch-card">
        <span>Share this code</span>
        <strong>{roomCode}</strong>
      </div>

      <section className="cr-players">
        <p className="cr-players-head">
          Players ({players.length})
          {players.length > 0 && <span className="cr-polling-dot" title="Auto-refreshing every 3s" />}
        </p>
        <div className="cr-players-grid">
          {players.length === 0 && (
            <p className="cr-footnote" style={{ margin: 0, textAlign: 'left' }}>
              Waiting for players to join. Share the room code above.
            </p>
          )}
          {players.map((p) => (
            <div key={p.id} className="cr-player sketch-card">
              <span className="cr-player-num">#{p.number || '-'}</span>
              <span className="cr-avatar">{'•~*+#' [p.avatar] || '?'}</span>
              <strong className="cr-player-name">{p.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="cr-preview-actions">
        <button
          type="button"
          className={`cr-primary-btn ${players.length === 0 ? 'cr-btn-waiting' : ''}`}
          onClick={players.length === 0 ? undefined : startRoom}
        >
          {starting && <StudentLoader variant="sam" size={18} title="Starting room" style={{ marginRight: 8, verticalAlign: 'middle' }} />}
          {starting ? 'Starting...' : players.length === 0 ? 'Waiting for players...' : 'Start quiz'}
        </button>
      </div>
    </main>
  )
}

export default CreateRoom
