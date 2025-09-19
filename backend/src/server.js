import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import songsRouter from './routes/songs.js';
import playlistsRouter from './routes/playlists.js';
import chatRouter from './routes/chat.js';
import statsRouter from './routes/stats.js';
import { connectDB } from './db/connect.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'music-playlist-organizer', version: '1.0.0' });
});

app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/stats', statsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

async function start() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    await connectDB(uri);
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
