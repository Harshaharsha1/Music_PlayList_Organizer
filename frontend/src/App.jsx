import React from 'react'
import { Link, Route, Routes, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import SongsPage from './pages/SongsPage.jsx'
import PlaylistsPage from './pages/PlaylistsPage.jsx'
import ChatbotPage from './pages/ChatbotPage.jsx'

export default function App() {
  return (
    <div className="bg-dark min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand text-white fw-bold">
            🎵 Music Organizer
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
            aria-controls="nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="nav" className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active fw-bold text-info' : 'text-white'}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/songs"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active fw-bold text-info' : 'text-white'}`
                  }
                >
                  Songs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/playlists"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active fw-bold text-info' : 'text-white'}`
                  }
                >
                  Playlists
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active fw-bold text-info' : 'text-white'}`
                  }
                >
                  Chatbot
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4 text-white flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
        </Routes>
      </main>
    </div>
  )
}
