import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

function PlaylistForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', description: '' })
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(form) }}
      className="card mb-3 border-0 shadow-lg"
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        color: 'white'
      }}
    >
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Description</label>
            <input
              className="form-control"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
              name="description"
              value={form.description}
              onChange={change}
            />
          </div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary px-4" type="submit">Save</button>
          {onCancel && (
            <button className="btn btn-secondary px-4" type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [songs, setSongs] = useState([])
  const [editing, setEditing] = useState(null)
  const [selectedSong, setSelectedSong] = useState('')

  const refetch = async () => {
    const [pl, sg] = await Promise.all([
      axios.get(`${API_BASE}/playlists`),
      axios.get(`${API_BASE}/songs`),
    ])
    setPlaylists(pl.data)
    setSongs(sg.data)
  }

  useEffect(() => { refetch() }, [])

  const onCreate = async data => {
    await axios.post(`${API_BASE}/playlists`, data)
    setEditing(null)
    await refetch()
  }
  const onUpdate = async (id, data) => {
    await axios.put(`${API_BASE}/playlists/${id}`, data)
    setEditing(null)
    await refetch()
  }
  const onDelete = async id => {
    await axios.delete(`${API_BASE}/playlists/${id}`)
    await refetch()
  }
  const addSong = async (playlistId) => {
    if (!selectedSong) return
    await axios.post(`${API_BASE}/playlists/${playlistId}/songs/${selectedSong}`)
    await refetch()
  }
  const removeSong = async (playlistId, songId) => {
    await axios.delete(`${API_BASE}/playlists/${playlistId}/songs/${songId}`)
    await refetch()
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
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="fw-bold" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          🎶 Playlists
        </h1>
        <button
          className="btn btn-success px-4"
          style={{ transition: 'all 0.3s ease' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          onClick={() => setEditing({})}
        >
          New Playlist
        </button>
      </div>

      {editing && (
        <PlaylistForm
          initial={editing.id ? editing : undefined}
          onSubmit={data => editing.id ? onUpdate(editing.id, data) : onCreate(data)}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="row g-4 mt-2">
        {playlists.map(p => (
          <div className="col-md-6" key={p.id}>
            <div
              className="card h-100 border-0 shadow-lg text-white"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{p.name}</h5>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-light" onClick={() => setEditing(p)}>Edit</button>
                    <button className="btn btn-outline-danger" onClick={() => onDelete(p.id)}>Delete</button>
                  </div>
                </div>
                <p className="text-light-50">{p.description}</p>

                <div className="d-flex gap-2 align-items-end">
                  <div className="flex-grow-1">
                    <label className="form-label">Add song</label>
                    <select
                      className="form-select"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                      value={selectedSong}
                      onChange={e => setSelectedSong(e.target.value)}
                    >
                      <option value="">Select a song...</option>
                      {songs.map(s => <option key={s.id} value={s.id}>{s.title} — {s.artist}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={() => addSong(p.id)}>Add</button>
                </div>

                <ul className="list-group mt-3">
                  {p.songIds.length === 0 && (
                    <li className="list-group-item bg-transparent text-white border-light">
                      No songs yet
                    </li>
                  )}
                  {p.songIds.map(id => {
                    const s = songs.find(x => x.id === id)
                    if (!s) return null
                    return (
                      <li
                        key={id}
                        className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white border-light"
                      >
                        <div>
                          <strong>{s.title}</strong> <span className="text-light-50">— {s.artist}</span>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeSong(p.id, id)}>Remove</button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
