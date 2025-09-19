import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

export const listPlaylists = async (req, res) => {
  const playlists = await Playlist.find().sort({ createdAt: -1 });
  res.json(playlists);
};

export const createPlaylist = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const playlist = await Playlist.create({ name, description });
  res.status(201).json(playlist);
};

export const getPlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  res.json(playlist);
};

export const updatePlaylist = async (req, res) => {
  const nextBody = { ...req.body };
  if (nextBody.songIds && !Array.isArray(nextBody.songIds)) delete nextBody.songIds;
  const playlist = await Playlist.findByIdAndUpdate(req.params.id, nextBody, { new: true });
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  res.json(playlist);
};

export const deletePlaylist = async (req, res) => {
  const playlist = await Playlist.findByIdAndDelete(req.params.id);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  res.json({ ok: true });
};

export const addSongToPlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  const song = await Song.findById(req.params.songId);
  if (!song) return res.status(404).json({ error: 'Song not found' });
  if (!playlist.songIds.map(String).includes(String(song.id))) {
    playlist.songIds.push(song.id);
    await playlist.save();
  }
  res.json(playlist);
};

export const removeSongFromPlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  playlist.songIds = playlist.songIds.filter(id => String(id) !== String(req.params.songId));
  await playlist.save();
  res.json(playlist);
};
