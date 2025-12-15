import { useState, useEffect } from 'react'
import QRGenerator from './components/QRGenerator'
import './index.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full min-h-screen flex items-center justify-center p-4">
        <QRGenerator />
      </main>
    </>
  )
}

export default App
