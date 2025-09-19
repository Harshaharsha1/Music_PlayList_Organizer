import Song from '../models/Song.js';

export async function searchLocalSongs(query) {
  if (!query || !query.trim()) {
    // If no specific search term, return recent songs
    return await Song.find().limit(10).sort({ createdAt: -1 });
  }
  
  // Remove common song-related words to get the actual search term
  const cleanQuery = query
    .replace(/\b(song|songs|my\s+songs|saved\s+songs|show\s+songs|music|track|library|collection)\b/gi, '')
    .trim();
  
  if (!cleanQuery) {
    // If no specific search term after cleaning, return all songs
    return await Song.find().limit(20).sort({ createdAt: -1 });
  }
  
  // Search by title, artist, album, or genre
  const searchRegex = new RegExp(cleanQuery, 'i');
  return await Song.find({
    $or: [
      { title: searchRegex },
      { artist: searchRegex },
      { album: searchRegex },
      { genre: searchRegex }
    ]
  }).limit(20).sort({ createdAt: -1 });
}

export async function getRecentSongs(limit = 10) {
  return await Song.find().limit(limit).sort({ createdAt: -1 });
}

export async function getSongsByArtist(artistName) {
  if (!artistName) return [];
  
  const searchRegex = new RegExp(artistName, 'i');
  return await Song.find({ artist: searchRegex }).sort({ createdAt: -1 });
}

export async function getSongsByGenre(genre) {
  if (!genre) return [];
  
  const searchRegex = new RegExp(genre, 'i');
  return await Song.find({ genre: searchRegex }).sort({ createdAt: -1 });
}

export async function getAllSongs() {
  return await Song.find().sort({ createdAt: -1 });
}