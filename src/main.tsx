import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { LangProvider } from './lib/LangContext'
import App from './App.tsx'
import { QuizPage } from './pages/Quiz'
import { PublicBookingPage } from './pages/PublicBooking'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <Routes>
          {/* Quiz -> diagnosis -> landing is one single page/flow (QuizPage
              owns local state for all of it, matching the original design) —
              "/" is the whole funnel, not just the landing content. */}
          <Route path="/" element={<QuizPage />} />
          <Route path="/quiz" element={<Navigate to="/" replace />} />
          <Route path="/app/*" element={<App />} />
          {/* Each professional's public booking link (see AgendaOnline.tsx) —
              a bare slug, matched after every static route above since
              react-router ranks static paths above a dynamic :slug regardless
              of declaration order. */}
          <Route path="/:slug" element={<PublicBookingPage />} />
        </Routes>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  // A new service worker takes control (see sw.js's skipWaiting/clients.claim)
  // right after a fresh deploy — reload once so the tab picks up the new
  // build instead of the user needing to clear the cache manually.
  let refreshingAfterUpdate = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshingAfterUpdate) return
    refreshingAfterUpdate = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error)
  })
}
