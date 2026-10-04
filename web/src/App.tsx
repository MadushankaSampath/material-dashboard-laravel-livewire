import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import CardsPage from './pages/CardsPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import Onboarding from './pages/Onboarding'
import SettingsPage from './pages/SettingsPage'
import { AppProvider, useApp } from './state/AppContext'

function Gate() {
  const { authReady, authUser, home, homeError, refreshHome } = useApp()

  if (!authReady) return <Splash />
  if (!authUser) return <AuthPage />
  if (homeError && !home)
    return (
      <div className="page narrow stack center">
        <p className="error">{homeError}</p>
        <button className="btn" onClick={() => refreshHome()}>
          Try again
        </button>
      </div>
    )
  if (!home) return <Splash />
  if (!home.member) return <Onboarding />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function Splash() {
  return (
    <div className="splash">
      <div className="logo">₨</div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Gate />
      </BrowserRouter>
    </AppProvider>
  )
}
