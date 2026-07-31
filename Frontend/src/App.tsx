import Home from './pages/Home'
import CreateRoom from './pages/CreateRoom'
import WaitingRoom from './pages/WaitingRoom'
import HostQuiz from './pages/HostQuiz'
import AudienceQuiz from './pages/AudienceQuiz'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/host') {
    return <CreateRoom />
  }

  if (path === '/host-quiz') {
    return <HostQuiz />
  }

  if (path === '/wait' || path === '/waiting-room') {
    return <WaitingRoom />
  }

  if (path === '/audience-quiz') {
    return <AudienceQuiz />
  }

  return <Home />
}

export default App