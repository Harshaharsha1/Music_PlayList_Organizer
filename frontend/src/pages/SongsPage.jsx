import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

function SongForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', artist: '', album: '', genre: '', durationSec: '' })
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  return (
    <form 
      onSubmit={e => { e.preventDefault(); onSubmit({ ...form, durationSec: Number(form.durationSec) || 0 }) }} 
      className="card card-body mb-3 bg-dark text-white"
    >
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label text-white">Title</label>
          <input className="form-control" name="title" value={form.title} onChange={change} required />
        </div>
        <div className="col-md-4">
          <label className="form-label text-white">Artist</label>
          <input className="form-control" name="artist" value={form.artist} onChange={change} required />
        </div>
        <div className="col-md-4">
          <label className="form-label text-white">Album</label>
          <input className="form-control" name="album" value={form.album} onChange={change} />
        </div>
        <div className="col-md-4">
          <label className="form-label text-white">Genre</label>
          <input className="form-control" name="genre" value={form.genre} onChange={change} />
        </div>
        <div className="col-md-4">
          <label className="form-label text-white">Duration (sec)</label>
          <input className="form-control" type="number" min="0" name="durationSec" value={form.durationSec} onChange={change} />
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" type="submit">Save</button>
        {onCancel && <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default function SongsPage() {
  const [songs, setSongs] = useState([])
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ artist: '', genre: '' })

  const refetch = async () => {
    const params = {}
    if (query) params.q = query
    if (filters.artist) params.artist = filters.artist
    if (filters.genre) params.genre = filters.genre
    const res = await axios.get(`${API_BASE}/songs`, { params })
    setSongs(res.data)
  }

  useEffect(() => { refetch() }, [])

  const onCreate = async data => {
    await axios.post(`${API_BASE}/songs`, data)
    setEditing(null)
    await refetch()
  }
  const onUpdate = async (id, data) => {
    await axios.put(`${API_BASE}/songs/${id}`, data)
    setEditing(null)
    await refetch()
  }
  const onDelete = async id => {
    await axios.delete(`${API_BASE}/songs/${id}`)
    await refetch()
  }

  const filtered = useMemo(() => songs, [songs])

  return (
    <div className="text-white">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="text-white">Songs</h1>
        <button className="btn btn-success" onClick={() => setEditing({})}>Add Song</button>
      </div>

      <div className="row g-2 mt-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Filter by artist" value={filters.artist} onChange={e => setFilters(f => ({...f, artist: e.target.value}))} />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Filter by genre" value={filters.genre} onChange={e => setFilters(f => ({...f, genre: e.target.value}))} />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-outline-primary" onClick={refetch}>Apply</button>
        </div>
      </div>

      {editing && (
        <SongForm
          initial={editing.id ? editing : undefined}
          onSubmit={data => editing.id ? onUpdate(editing.id, data) : onCreate(data)}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="table-responsive mt-3">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Duration</th>
              <th style={{width: 160}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.artist}</td>
                <td>{s.album}</td>
                <td>{s.genre}</td>
                <td>{s.durationSec ? `${Math.floor(s.durationSec/60)}:${String(s.durationSec%60).padStart(2,'0')}` : '-'}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-light" onClick={() => setEditing(s)}>Edit</button>
                    <button className="btn btn-outline-danger" onClick={() => onDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
