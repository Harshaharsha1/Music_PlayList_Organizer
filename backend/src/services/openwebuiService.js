import axios from 'axios';

const API_URL = process.env.OPENWEBUI_API_URL;
const API_KEY = process.env.OPENWEBUI_API_KEY;
const MODEL = process.env.OPENWEBUI_MODEL || 'gpt-3.5-turbo';

export async function generateChatReply(userMessage, songItems = [], playlistItems = [], contextType = 'songs') {
  if (!API_URL || !API_KEY) return null;

  let system, content;
  
  if (contextType === 'playlists' && playlistItems.length > 0) {
    system = 'You are a helpful music assistant. The user asked about playlists, and you found some matching saved playlists. Craft a friendly response that describes the playlists and their contents. Keep it under 100 words.';
    
    const playlistsText = playlistItems.map(p => 
      `- "${p.name}" ${p.description ? `(${p.description})` : ''}: ${p.songCount} songs${p.songs.length > 0 ? ` including ${p.songs.join(', ')}` : ''}`
    ).join('\n');
    
    const songsText = songItems.length > 0 
      ? `\n\nAdditional song suggestions:\n${songItems.map(i => `- ${i.artist} — ${i.title}`).join('\n')}`
      : '';
    
    content = `User query: ${userMessage}\n\nFound playlists:\n${playlistsText}${songsText}`;
  } else {
    system = 'You are a helpful music discovery assistant. Given a user query and songs found from iTunes, craft a concise friendly reply that references some of the songs (artist - title) and invites exploration. Keep it under 80 words.';
    
    const songsText = songItems.length > 0
      ? songItems.map(i => `- ${i.artist} — ${i.title}${i.album ? ` (${i.album})` : ''}${i.genre ? ` [${i.genre}]` : ''}`).join('\n')
      : 'No songs found.';
    
    content = `User query: ${userMessage}\n\nSong candidates:\n${songsText}`;
  }

  try {
    const { data } = await axios.post(
      `${API_URL.replace(/\/$/, '')}/v1/chat/completions`,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: content }
        ],
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: 10000
      }
    );
    const choice = data.choices && data.choices[0];
    return choice?.message?.content?.trim() || null;
  } catch (err) {
    console.error('OpenWebUI error', err?.response?.data || err?.message);
    return null;
  }
}
