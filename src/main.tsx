import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { LangProvider } from './lib/LangContext'
import App from './App.tsx'
import { LandingPage } from './pages/Landing'
import { QuizPage } from './pages/Quiz'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/app/*" element={<App />} />
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
