import { useState, useEffect } from 'react'
import '../styles/WaitingRoom.css'
import { StudentLoader } from '../components/StudentMascots'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const avatarIcons = ['•', '~', '*', '+', '#', '!', '^', '?']

type Step = 'join' | 'waiting'

function WaitingRoom() {
  const [step, setStep] = useState<Step>('join')

  // Join form
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(0)
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)

  // Room state
  const [roomCode, setRoomCode] = useState('')
  const [roomTitle, setRoomTitle] = useState('')
  const [players, setPlayers] = useState<{ id: string; name: string; avatar: number; number?: number }[]>([])
  const [status, setStatus] = useState('lobby')

  const joinRoom = async () => {
    setError('')
    if (!code.trim() || !name.trim()) {
      setError('Enter room code and name')
      return
    }
    setJoining(true)
    try {
      const res = await fetch(`${API}/rooms/${code.trim()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name.trim(), avatar }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Cannot join room')
        return
      }
      const { room, player } = data.data
      setRoomCode(room.code)
      setRoomTitle(room.title)
      setPlayers(room.players)
      setStatus(room.status)
      sessionStorage.setItem('playerId', player.id)
      sessionStorage.setItem('playerName', player.name)
      if (room.status === 'live') {
        window.location.href = `/audience-quiz?code=${room.code}&playerId=${player.id}`
        return
      }
      setStep('waiting')
    } catch {
      setError('Cannot reach server')
    } finally {
      setJoining(false)
    }
  }

  // Poll room state every 3s while waiting
  useEffect(() => {
    if (step !== 'waiting' || !roomCode) return
    const id = setInterval(async () => {
      try {
        const res = await fetch(`${API}/rooms/${roomCode}`)
        const data = await res.json()
        if (data.success) {
          setPlayers(data.data.players)
          setRoomTitle(data.data.title)
          const newStatus = data.data.status
          setStatus(newStatus)
          if (newStatus === 'live') {
            const playerId = sessionStorage.getItem('playerId')
            if (playerId) {
              window.location.href = `/audience-quiz?code=${roomCode}&playerId=${playerId}`
            }
          }
        }
      } catch {
        // ignore
      }
    }, 3000)
    return () => clearInterval(id)
  }, [step, roomCode])

  // ── Join form ──────────────────────────────────────────────
  if (step === 'join') {
    return (
      <main className="wr-page">
        <button type="button" className="wr-back" onClick={() => window.location.href = '/'}>&larr; Back</button>
        <header className="wr-header">
          <p className="wr-eyebrow">Join a competition</p>
          <h1>Enter the room</h1>
        </header>

        <section className="wr-card sketch-card">
          <div className="wr-fields">
            <label className="wr-field">
              <span>Room code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
              />
            </label>

            <label className="wr-field">
              <span>Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pick a display name"
              />
            </label>

            <div className="wr-avatars">
              <span>Choose avatar</span>
              <div className="wr-avatar-row">
                {avatarIcons.map((icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`wr-avatar-btn ${avatar === i ? 'is-active' : ''}`}
                    onClick={() => setAvatar(i)}
                    aria-label={`Avatar ${i + 1}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="wr-error">{error}</p>}

          <button type="button" className="wr-primary-btn" onClick={joinRoom} disabled={joining}>
            {joining && <StudentLoader variant="alex" size={18} title="Joining room" style={{ marginRight: 8, verticalAlign: 'middle' }} />}
            {joining ? 'Joining...' : 'Join room'}
          </button>
        </section>
      </main>
    )
  }

  // ── Waiting room ───────────────────────────────────────────
  return (
    <main className="wr-page">
      <button type="button" className="wr-back" onClick={() => window.location.href = '/'}>&larr; Back</button>
      <header className="wr-header">
        <p className="wr-eyebrow">{roomTitle}</p>
        <h1>Waiting for host to start</h1>
      </header>

      <div className="wr-code-badge sketch-card">
        <span>Room code</span>
        <strong>{roomCode}</strong>
      </div>

      <section className="wr-players">
        <p className="wr-players-head">Players ({players.length})</p>
        <div className="wr-players-grid">
          {players.map((p) => (
            <div key={p.id} className="wr-player sketch-card">
              <span className="wr-avatar">{avatarIcons[p.avatar] || '?'}</span>
              <strong className="wr-player-name">{p.name}</strong>
            </div>
          ))}
        </div>
      </section>

      {status === 'live' && (
        <div className="wr-started">
          <p>The competition has started!</p>
        </div>
      )}

      {status === 'lobby' && (
        <p className="wr-footnote">Waiting for the host to start the competition.</p>
      )}
    </main>
  )
}

export default WaitingRoom