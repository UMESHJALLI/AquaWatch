import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import UploadAnalysis from './pages/UploadAnalysis'
import SiteMonitoring from './pages/SiteMonitoring'
import ForecastAlerts from './pages/ForecastAlerts'

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme')
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/upload" element={<UploadAnalysis />} />
                    <Route path="/sites" element={<SiteMonitoring />} />
                    <Route path="/forecast" element={<ForecastAlerts />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
