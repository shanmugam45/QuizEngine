import { useMemo, useState } from 'react'
import '../styles/Home.css'
import { StudentAvatar } from '../components/StudentMascots'

const featurePills = ['Live rooms', 'Sketchy votes', 'Lightning rounds']

const boardSets = [
  {
    round: 'Question 01', timer: 15,
    question: 'Which player move helps the team score faster on a hard round?',
    advice: ['Quick first move', "Don't overthink", 'Use the hint', 'Save your focus'],
  },
  {
    round: 'Question 02', timer: 20,
    question: 'What should you do when the question looks too familiar?',
    advice: ['Read the wording', 'Pick the prompt', 'Eliminate the weak', 'Stay calm'],
  },
  {
    round: 'Question 03', timer: 18,
    question: 'How do you keep the lead when the room starts getting loud?',
    advice: ['Lock the safe', 'Protect the lead', 'Keep your rhythm', 'No panic moves'],
  },
  {
    round: 'Question 04', timer: 12,
    question: 'Which habit gives you the best chance to finish on top?',
    advice: ['Answer with confidence', 'Choose the clue', 'Double-check the final', 'Every point matters'],
  },
]

const controlCards = [
  { value: '24', label: 'players queued' },
  { value: '08', label: 'questions ready' },
  { value: '60s', label: 'round timer' },
]

const features = [
  { index: '01', title: 'Choose the crowd', desc: 'Tune the room for students, friends, or a mixed group so the quiz feels immediate instead of generic.' },
  { index: '02', title: 'Pick the deck', desc: 'Swap between lighter warm-ups and harder battle rounds before you press launch.' },
  { index: '03', title: 'Go live together', desc: 'Start the lobby, watch people join, and carry the room straight into the quiz.' },
]

function Home() {
  const [activeAdviceIndex, setActiveAdviceIndex] = useState(0)

  const selectedBoardSet = useMemo(() => {
    const i = Math.floor(Math.random() * boardSets.length)
    return boardSets[i]
  }, [])

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">QuizEngine energy, redrawn by hand</p>
          <h1>Quiz nights with the volume cranked up and the polish scraped off.</h1>
        </div>
        <div className="room-stamp" aria-label="Room code">
          <StudentAvatar variant="sam" size={54} title="Quiz mascot" />
          <span>LIVE ROOM</span>
          <strong>INK-42</strong>
        </div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy sketch-card">
          <div className="scribble-line" aria-hidden="true" />
          <p className="label-row">
            <span>ROUND 07</span>
            <span>MARKER MODE</span>
          </p>
          <h2>Race, guess, shout, and watch the leaderboard redraw itself in real time.</h2>
          <p className="lead">
            A playful quiz platform built like a stack of classroom notes: rough edges, bold
            strokes, zero color, and all the momentum of a live game night.
          </p>
          <div className="cta-row">
            <button type="button" className="primary-btn" onClick={() => window.location.href = '/host'}>
              Start a room
            </button>
            <button type="button" className="secondary-btn" onClick={() => window.location.href = '/wait'}>
              Join with code
            </button>
          </div>
          <div className="pill-row" aria-label="Platform features">
            {featurePills.map((pill) => (
              <span key={pill} className="pill">{pill}</span>
            ))}
          </div>
          <div className="social-pill-row" aria-label="Social links">
            <a href="mailto:shanmugamb332@gmail.com" className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://github.com/shanmugam45" className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/shanmugam-boopathy-b60149292" className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/errrork_19399" className="social-pill" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
          <div className="scribble-line" aria-hidden="true" />
        </div>

        <aside className="game-board sketch-card">
          <div className="board-top">
            <p>{selectedBoardSet.round}</p>
            <span className="timer">{selectedBoardSet.timer}</span>
          </div>
          <h3>{selectedBoardSet.question}</h3>
          <p className="board-hint">Click an advice card to focus in on the strongest angle.</p>
          <div className="answers" role="list" aria-label="Question advice">
            {selectedBoardSet.advice.map((advice, index) => (
              <article
                key={advice}
                className={`choice ${activeAdviceIndex === index ? 'is-active' : ''}`}
                role="listitem"
              >
                <button
                  type="button"
                  className="choice-button"
                  onClick={() => setActiveAdviceIndex(index)}
                  aria-pressed={activeAdviceIndex === index}
                >
                  <span className="choice-label">{index + 1}</span>
                  <span className="choice-copy">{advice}</span>
                </button>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="stats-row" aria-label="Game stats">
        {controlCards.map((stat) => (
          <article key={stat.label} className="stat-card sketch-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="feature-grid">
        {features.map((f) => (
          <article key={f.index} className="feature-card sketch-card">
            <p className="feature-index">{f.index}</p>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Home