import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';

export const listSongs = async (req, res) => {
  const { q, artist, genre } = req.query;
  const filter = {};
  if (q) {
    const term = new RegExp(q, 'i');
    filter.$or = [
      { title: term },
      { artist: term },
      { album: term },
    ];
  }
  if (artist) filter.artist = new RegExp(artist, 'i');
  if (genre) filter.genre = new RegExp(genre, 'i');
  const results = await Song.find(filter).sort({ createdAt: -1 });
  res.json(results);
};

export const searchSongs = (req, res) => listSongs(req, res);

export const createSong = async (req, res) => {
  const { title, artist, album, genre, durationSec } = req.body;
  if (!title || !artist) return res.status(400).json({ error: 'title and artist are required' });
  const song = await Song.create({ title, artist, album, genre, durationSec: Number(durationSec) || 0 });
  res.status(201).json(song);
};

export const getSong = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ error: 'Song not found' });
  res.json(song);
};

export const updateSong = async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!song) return res.status(404).json({ error: 'Song not found' });
  res.json(song);
};

export const deleteSong = async (req, res) => {
  const song = await Song.findByIdAndDelete(req.params.id);
  if (!song) return res.status(404).json({ error: 'Song not found' });
  // Remove from any playlists
  await Playlist.updateMany({}, { $pull: { songIds: song.id } });
  res.json({ ok: true });
};
