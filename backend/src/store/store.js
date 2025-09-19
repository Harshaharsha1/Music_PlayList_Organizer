const store = {
  songs: [
    { id: 'seed-1', title: 'Imagine', artist: 'John Lennon', album: 'Imagine', genre: 'Rock', durationSec: 183 },
    { id: 'seed-2', title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', genre: 'Pop', durationSec: 294 }
  ],
  playlists: [
    { id: 'mix-1', name: 'My Mix', description: 'Favorites', songIds: ['seed-1'] }
  ]
};

export default store;
