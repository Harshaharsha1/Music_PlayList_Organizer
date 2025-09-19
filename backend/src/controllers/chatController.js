import { searchItunes } from '../services/itunesService.js';
import { generateChatReply } from '../services/openwebuiService.js';
import { searchPlaylists, getPlaylistWithSongs, searchPlaylistsBySongContent } from '../services/playlistSearchService.js';
import { searchLocalSongs } from '../services/localSongSearchService.js';

export async function askChat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const lowerMessage = message.toLowerCase();
    const isPlaylistQuery = /\b(playlist|playlists|my\s+playlist|saved\s+playlist|show\s+playlist)\b/i.test(message);
    const isSongQuery = /\b(song|songs|my\s+songs|saved\s+songs|show\s+songs|music|track)\b/i.test(message);
    const isLibraryQuery = /\b(library|my\s+library|collection|show\s+all)\b/i.test(message);

    let localSongs = [];
    let playlists = [];
    let itunesResults = [];
    let contextType = 'mixed';

    // Always search local content first
    if (isPlaylistQuery || isLibraryQuery) {
      // Search local playlists
      playlists = await searchPlaylists(message);
      if (playlists.length > 0) {
        playlists = await Promise.all(
          playlists.map(async (p) => await getPlaylistWithSongs(p.id))
        );
        contextType = 'playlists';
      }
      
      // Also search for playlists containing songs that match the query
      if (playlists.length === 0 && !isLibraryQuery) {
        const playlistsBySongContent = await searchPlaylistsBySongContent(message);
        if (playlistsBySongContent.length > 0) {
          playlists = await Promise.all(
            playlistsBySongContent.map(async (p) => await getPlaylistWithSongs(p.id))
          );
          contextType = 'playlists';
        }
      }
    }

    if (isSongQuery || isLibraryQuery || (!isPlaylistQuery && playlists.length === 0)) {
      // Search local songs collection
      localSongs = await searchLocalSongs(message);
      if (localSongs.length > 0) {
        contextType = contextType === 'playlists' ? 'mixed' : 'songs';
      }
    }

    // Only search iTunes if no local results found or user explicitly asks for "more" or "discover"
    const needsItunesSearch = 
      (localSongs.length === 0 && playlists.length === 0) ||
      lowerMessage.includes('more') || 
      lowerMessage.includes('discover') ||
      lowerMessage.includes('find new') ||
      lowerMessage.includes('itunes');
    
    if (needsItunesSearch) {
      itunesResults = await searchItunes(message, 'song', 5);
    }

    // Generate contextual reply
    let reply = '';
    if (playlists.length > 0 && localSongs.length > 0) {
      reply = `Found ${playlists.length} playlist(s) and ${localSongs.length} song(s) in your library:`;
    } else if (playlists.length > 0) {
      reply = playlists.length === 1 
        ? `Found your playlist "${playlists[0].name}":`
        : `Found ${playlists.length} playlists in your library:`;
    } else if (localSongs.length > 0) {
      reply = `Found ${localSongs.length} song(s) in your library:`;
    } else if (itunesResults.length > 0) {
      reply = "No matches in your library. Here are some suggestions from iTunes:";
    } else {
      reply = "No matches found in your library or iTunes. Try adding some songs or playlists first!";
    }

    // Use OpenWebUI to craft a smarter reply
    try {
      const localSongItems = localSongs.map(s => ({
        title: s.title,
        artist: s.artist,
        album: s.album,
        genre: s.genre,
        source: 'local'
      }));
      
      const itunesSongItems = itunesResults.map(r => ({
        title: r.trackName,
        artist: r.artistName,
        album: r.collectionName,
        genre: r.primaryGenreName,
        source: 'itunes'
      }));
      
      const playlistItems = playlists.map(p => ({
        name: p.name,
        description: p.description,
        songCount: p.songs?.length || 0,
        songs: (p.songs || []).slice(0, 3).map(s => `${s.artist} - ${s.title}`)
      }));

      const aiReply = await generateChatReply(
        message, 
        [...localSongItems, ...itunesSongItems], 
        playlistItems, 
        contextType
      );
      if (aiReply) reply = aiReply;
    } catch (e) {
      // If OpenWebUI fails, keep fallback reply
    }

    res.json({
      reply,
      localSongs: localSongs.map(s => ({
        type: 'local_song',
        id: s.id,
        title: s.title,
        artist: s.artist,
        album: s.album,
        genre: s.genre,
        durationSec: s.durationSec,
        source: 'Your Library'
      })),
      playlists: playlists.map(p => ({
        type: 'playlist',
        id: p.id,
        name: p.name,
        description: p.description,
        songCount: p.songs?.length || 0,
        songs: (p.songs || []).slice(0, 5),
        source: 'Your Library'
      })),
      items: itunesResults.map(r => ({
        type: 'song',
        title: r.trackName,
        artist: r.artistName,
        album: r.collectionName,
        genre: r.primaryGenreName,
        previewUrl: r.previewUrl,
        artworkUrl: r.artworkUrl100,
        link: r.trackViewUrl,
        source: 'iTunes'
      }))
    });
  } catch (err) {
    console.error('Chat error', err);
    res.status(500).json({ error: 'Failed to process your request' });
  }
}
