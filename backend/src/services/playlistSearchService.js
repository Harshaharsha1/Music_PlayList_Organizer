import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

export async function searchPlaylists(query) {
  if (!query || !query.trim()) return [];
  
  // Remove common playlist-related words to get the actual search term
  const cleanQuery = query
    .replace(/\b(playlist|playlists|my\s+playlist|saved\s+playlist|show\s+playlist)\b/gi, '')
    .trim();
  
  if (!cleanQuery) {
    // If no specific search term, return all playlists
    return await Playlist.find().limit(10).sort({ createdAt: -1 });
  }
  
  // Search by playlist name or description
  const searchRegex = new RegExp(cleanQuery, 'i');
  return await Playlist.find({
    $or: [
      { name: searchRegex },
      { description: searchRegex }
    ]
  }).limit(10).sort({ createdAt: -1 });
}

export async function getPlaylistWithSongs(playlistId) {
  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return null;
    
    // Populate songs from the songIds
    const songs = await Song.find({
      _id: { $in: playlist.songIds }
    });
    
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      songIds: playlist.songIds,
      songs: songs.map(song => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        genre: song.genre,
        durationSec: song.durationSec
      })),
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt
    };
  } catch (error) {
    console.error('Error getting playlist with songs:', error);
    return null;
  }
}

export async function searchPlaylistsBySongContent(query) {
  // Advanced search: find playlists that contain songs matching the query
  if (!query || !query.trim()) return [];
  
  const searchRegex = new RegExp(query.trim(), 'i');
  
  // First, find songs that match the query
  const matchingSongs = await Song.find({
    $or: [
      { title: searchRegex },
      { artist: searchRegex },
      { album: searchRegex }
    ]
  });
  
  if (matchingSongs.length === 0) return [];
  
  const matchingSongIds = matchingSongs.map(song => song._id);
  
  // Then find playlists containing these songs
  return await Playlist.find({
    songIds: { $in: matchingSongIds }
  }).limit(10).sort({ createdAt: -1 });
}