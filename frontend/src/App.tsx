import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Logs from './pages/Logs'

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '1rem 2rem',
        backgroundColor: '#2d2d2d',
        borderBottom: '2px solid #444',
        zIndex: 1000
      }}>
        <h2 style={{ margin: 0, color: '#e0e0e0', fontSize: '1.5rem' }}>GDA Backup</h2>
        <Link to="/" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '1rem' }}>Home</Link>
        <Link to="/settings" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '1rem' }}>Settings</Link>
        <Link to="/logs" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '1rem' }}>Logs</Link>
      </nav>
      <div style={{ marginTop: '80px' }} className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
