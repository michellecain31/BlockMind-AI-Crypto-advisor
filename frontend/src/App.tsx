import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

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

import { validateToken } from './services/authService'

type ProtectedRouteProps = {
  children: ReactNode
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [isChecking, setIsChecking] =
    useState(true)

  const [isAuthenticated, setIsAuthenticated] =
    useState(false)

  useEffect(() => {
    let isMounted = true

    const checkAuthentication = async () => {
      const isValid = await validateToken()

      if (!isMounted) {
        return
      }

      if (!isValid) {
        localStorage.removeItem(
          'blockmind_token',
        )

        localStorage.removeItem(
          'blockmind_user',
        )
      }

      setIsAuthenticated(isValid)
      setIsChecking(false)
    }

    void checkAuthentication()

    return () => {
      isMounted = false
    }
  }, [])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14] text-white">
        <div className="text-sm text-slate-400">
          Checking session...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
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