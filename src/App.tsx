import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import AuthRelayDebugPage from './pages/AuthRelayDebugPage'
import AuthDesktopCompletePage from './pages/AuthDesktopCompletePage'
import AffordableInterviewAssistantsPage from './pages/AffordableInterviewAssistantsPage'
import ParakeetAlternativePage from './pages/ParakeetAlternativePage'
import FinalRoundAlternativePage from './pages/FinalRoundAlternativePage'
import InterviewWarmupAlternativePage from './pages/InterviewWarmupAlternativePage'
import LockedInAlternativePage from './pages/LockedInAlternativePage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth" element={<AuthRelayDebugPage />} />
      <Route path="/auth/desktop" element={<AuthRelayDebugPage />} />
      <Route path="/auth/desktop-complete" element={<AuthDesktopCompletePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/affordable-interview-assistants" element={<AffordableInterviewAssistantsPage />} />
      <Route path="/alternatives/parakeet-ai" element={<ParakeetAlternativePage />} />
      <Route path="/alternatives/final-round-ai" element={<FinalRoundAlternativePage />} />
      <Route path="/alternatives/interview-warmup" element={<InterviewWarmupAlternativePage />} />
      <Route path="/alternatives/lockedin-ai" element={<LockedInAlternativePage />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
