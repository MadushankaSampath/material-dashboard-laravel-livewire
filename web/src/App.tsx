import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BusyOverlay from './components/BusyOverlay'
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

  // With data saved on this device, show the app straight away; Firebase Auth
  // restores the session and the cloud refresh runs in the background.
  if (!authReady && !home) return <Splash />
  if (authReady && !authUser) return <AuthPage />
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
      <div className="center">
        <div className="logo">₨</div>
        <p className="muted small">Loading your data…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Gate />
        <BusyOverlay />
      </BrowserRouter>
    </AppProvider>
  )
}
