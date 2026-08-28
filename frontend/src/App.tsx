import type { ReactNode } from 'react'
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import CoinDetailsPage from './pages/CoinDetailsPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'

type ProtectedRouteProps = {
  children: ReactNode
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = localStorage.getItem(
    'blockmind_token',
  )

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/signup"
        element={<SignupPage />}
      />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coin/:coinId"
        element={
          <ProtectedRoute>
            <CoinDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App