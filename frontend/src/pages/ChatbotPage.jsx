import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

export default function ChatbotPage() {
  const [input, setInput] = useState('show my library')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me about your music library. Try "show my library", "my rock songs", "show playlists", or ask for specific artists like "coldplay songs".' }
  ])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(m => [...m, userMsg])
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/chat/ask`, { message: input })
      const items = res.data.items || [] // iTunes results
      const localSongs = res.data.localSongs || [] // Local library songs
      const playlists = res.data.playlists || []
      const reply = res.data.reply || 'Here is what I found:'
      setMessages(m => [...m, { role: 'assistant', text: reply, items, localSongs, playlists }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: 'Sorry, I had trouble reaching the discovery service.' }])
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
        color: 'white',
        padding: '30px'
      }}
    >
      <h1 className="text-center mb-4 fw-bold" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
        🎵 Song Discovery Chatbot
      </h1>
      <div className="row g-3 justify-content-center">
        <div className="col-md-8">
          <div
            className="card shadow-lg border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              overflow: 'hidden'
            }}
          >
            <div className="card-body" style={{ minHeight: 400, transition: 'all 0.3s ease' }}>
              {messages.map((m, idx) => (
                <div key={idx} className={`mb-3 ${m.role === 'user' ? 'text-end' : ''}`}>
                  <div
                    className={`d-inline-block p-3 rounded-4`}
                    style={{
                      maxWidth: '80%',
                      background: m.role === 'user'
                        ? 'linear-gradient(135deg, #007bff, #3399ff)'
                        : 'rgba(255,255,255,0.1)',
                      color: m.role === 'user' ? 'white' : '#ddd',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    {/* Display playlists from your library */}
                    {m.playlists && m.playlists.length > 0 && (
                      <div className="mt-3">
                        <div className="small text-info mb-2">📁 Your Playlists:</div>
                        {m.playlists.map((p, j) => (
                          <div
                            key={`playlist-${j}`}
                            className="border rounded-3 p-3 mb-2"
                            style={{
                              background: 'rgba(0,123,255,0.1)',
                              borderColor: 'rgba(0,123,255,0.3)'
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong>📁 {p.name}</strong>
                              <small className="text-muted">{p.songCount} songs</small>
                            </div>
                            {p.description && (
                              <div className="text-muted small mb-2">{p.description}</div>
                            )}
                            {p.songs && p.songs.length > 0 && (
                              <div className="mt-2">
                                {p.songs.slice(0, 4).map((s, k) => (
                                  <div key={k} className="small d-flex justify-content-between">
                                    <span>♪ {s.artist} - {s.title}</span>
                                    {s.durationSec > 0 && (
                                      <span className="text-muted">
                                        {Math.floor(s.durationSec/60)}:{String(s.durationSec%60).padStart(2,'0')}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {p.songs.length > 4 && (
                                  <div className="small text-muted mt-1">
                                    ... and {p.songs.length - 4} more songs
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Display songs from your library */}
                    {m.localSongs && m.localSongs.length > 0 && (
                      <div className="mt-3">
                        <div className="small text-success mb-2">🎵 Your Songs:</div>
                        {m.localSongs.map((s, j) => (
                          <div
                            key={`local-song-${j}`}
                            className="d-flex align-items-center justify-content-between p-2 mb-1 rounded-2"
                            style={{
                              background: 'rgba(40,167,69,0.1)',
                              borderLeft: '3px solid rgba(40,167,69,0.5)'
                            }}
                          >
                            <div>
                              <div>
                                <strong>{s.title}</strong>{' '}
                                <span className="text-muted">— {s.artist}</span>
                              </div>
                              {(s.album || s.genre) && (
                                <div className="small text-muted">
                                  {s.album && `${s.album}`}{s.album && s.genre && ' • '}{s.genre && `${s.genre}`}
                                </div>
                              )}
                            </div>
                            {s.durationSec > 0 && (
                              <span className="small text-muted">
                                {Math.floor(s.durationSec/60)}:{String(s.durationSec%60).padStart(2,'0')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Display iTunes song suggestions */}
                    {m.items && m.items.length > 0 && (
                      <div className="mt-3">
                        <div className="small text-warning mb-2">🎵 iTunes Suggestions:</div>
                        {m.items.map((i, j) => (
                          <div
                            key={`itunes-${j}`}
                            className="d-flex align-items-center gap-2 p-2 rounded-2"
                            style={{
                              background: 'rgba(255,193,7,0.1)',
                              borderLeft: '3px solid rgba(255,193,7,0.5)'
                            }}
                          >
                            {i.artworkUrl && (
                              <img
                                src={i.artworkUrl}
                                alt="artwork"
                                width={40}
                                height={40}
                                style={{ borderRadius: 6 }}
                              />
                            )}
                            <div className="flex-grow-1">
                              <div>
                                <strong>{i.title}</strong>{' '}
                                <span className="text-muted">— {i.artist}</span>
                              </div>
                              {i.album && (
                                <div className="small text-muted">{i.album}</div>
                              )}
                              {i.previewUrl && (
                                <audio controls src={i.previewUrl} style={{ width: 180 }} />
                              )}
                              {i.link && (
                                <div>
                                  <a
                                    href={i.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-info small"
                                    style={{ textDecoration: 'none' }}
                                  >
                                    🎵 Open in iTunes
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && <div className="text-center mt-3">🔎 Searching…</div>}
            </div>
            <div className="card-footer border-0" style={{ background: 'transparent' }}>
              <div className="input-group">
                <input
                  className="form-control rounded-start-pill"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me to find songs or playlists..."
                  onKeyDown={e => e.key === 'Enter' && send()}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    transition: 'all 0.3s ease'
                  }}
                />
                <button
                  className="btn rounded-end-pill px-4"
                  onClick={send}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #007bff, #00d4ff)',
                    border: 'none',
                    color: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
