# Backend - Music Playlist Organizer

## Setup
1. Copy .env.example to .env and adjust if needed
```
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
```
2. Install dependencies
```
npm install
```
3. Start dev server
```
npm run dev
```

## Endpoints
- GET / -> service health
- /api/songs
  - GET / (query: q, artist, genre)
  - GET /search (same as GET /)
  - POST / { title, artist, album?, genre?, durationSec? }
  - GET /:id
  - PUT /:id
  - DELETE /:id
- /api/playlists
  - GET /
  - POST / { name, description? }
  - GET /:id
  - PUT /:id
  - DELETE /:id
  - POST /:id/songs/:songId
  - DELETE /:id/songs/:songId
- /api/chat
  - POST /ask { message }
- /api/stats
  - GET /

## Notes
- In-memory store is reset on server restart.
- Chatbot uses iTunes Search API (no API key required).
