import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0d14',
          fontFamily: "'VT323', 'Courier New', monospace",
          color: '#4af0c8',
          padding: '20px',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px', letterSpacing: '4px' }}>ALT-TAB</h1>
          <p style={{ fontSize: '20px', color: '#c8d8f0', marginBottom: '24px' }}>Something went wrong.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            style={{
              background: '#4af0c8',
              color: '#0a0d14',
              border: 'none',
              padding: '10px 24px',
              fontSize: '18px',
              fontFamily: "'VT323', 'Courier New', monospace",
              cursor: 'pointer',
              letterSpacing: '2px',
            }}
          >
            [ RELOAD ]
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
