import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';

export const getStats = async (req, res) => {
  const [songs, playlists] = await Promise.all([
    Song.countDocuments(),
    Playlist.countDocuments()
  ]);
  res.json({ songs, playlists });
};
