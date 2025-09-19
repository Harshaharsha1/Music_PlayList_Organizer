import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

export default function Dashboard() {
  const [stats, setStats] = useState({ songs: 0, playlists: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_BASE}/stats`).then(res => {
      setStats(res.data)
    }).catch(() => {
      setStats({ songs: 0, playlists: 0 })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
        color: 'white',
        padding: '30px'
      }}
    >
      <h1 className="text-center mb-5 fw-bold" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
        📊 Dashboard
      </h1>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-light" role="status"></div>
          <p className="mt-3">Loading stats...</p>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          <div className="col-md-5">
            <div
              className="card shadow-lg border-0 text-center text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '25px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
            >
              <h5 className="fw-semibold">🎵 Songs</h5>
              <p className="display-5 fw-bold mb-0">{stats.songs}</p>
            </div>
          </div>

          <div className="col-md-5">
            <div
              className="card shadow-lg border-0 text-center text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '25px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
            >
              <h5 className="fw-semibold">📂 Playlists</h5>
              <p className="display-5 fw-bold mb-0">{stats.playlists}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
