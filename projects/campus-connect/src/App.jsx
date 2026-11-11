import React, { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { UserProvider } from './context/UserContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AppRoutes } from './routes/AppRoutes'

const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <ToastProvider>
        <AuthProvider>
          <EventProvider>
            <UserProvider>
              <div className="min-h-screen flex flex-col bg-[#F8F7F3] text-[#25282D] selection:bg-[#722F43] selection:text-white font-sans">
                <Navbar />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </UserProvider>
          </EventProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App

