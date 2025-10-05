import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { AboutPage } from './pages/AboutPage'
import { TeamPage } from './pages/TeamPage'
import SpaceAdventure from './components/games/SpaceAdventure'
import SpaceQuizChallenge from './components/games/SpaceQuizChallenge'
import QuizGame from './components/games/QuizGame'
import ScrollToTop from './components/ScrollToTop'
import VR from './components/VR'


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/games" element={<ExplorePage />} />
          <Route path="/games/space-adventure" element={<SpaceAdventure />} />
          <Route path="/games/space-quiz-challenge" element={<SpaceQuizChallenge />} />
          <Route path="/games/quiz/play" element={<QuizGame />} />
          <Route path="/games/vr-exploration" element={<VR />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
