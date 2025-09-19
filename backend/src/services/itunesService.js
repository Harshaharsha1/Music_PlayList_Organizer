import axios from 'axios';

export async function searchItunes(term, entity = 'song', limit = 5) {
  if (!term || !term.trim()) return [];
  const url = 'https://itunes.apple.com/search';
  const params = { term, entity, limit };
  const { data } = await axios.get(url, { params });
  // Map to a simple format
  return (data.results || []).map(r => ({
    trackName: r.trackName,
    artistName: r.artistName,
    collectionName: r.collectionName,
    previewUrl: r.previewUrl,
    artworkUrl100: r.artworkUrl100,
    trackViewUrl: r.trackViewUrl,
    primaryGenreName: r.primaryGenreName,
  }));
}
