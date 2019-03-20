
exports.seed = function(knex, Promise) {
  return knex.raw("TRUNCATE playlist_songs restart identity;")
    .then(() => knex.raw("TRUNCATE playlists restart identity CASCADE;"))
    .then(() => knex.raw("TRUNCATE playlists restart identity CASCADE;"))
    .then(() => {
      return Promise.all([
        knex('songs').insert([
          {name: 'song_1',artist_name: 'artist_1', genre: 'Pop',rating: 88},
          {name: 'song_2',artist_name: 'artist_2', genre: 'Rock',rating: 80},
          {name: 'song_3',artist_name: 'artist_3', genre: 'Country',rating: 81}
        ],'id')
        .then((songs) => {
          console.log('seeded songs');
          return knex('playlists').insert([
            {name: 'playlist_1'},
            {name: 'playlist_2'},
            {name: 'playlist_3'}
          ], 'id')
          .then((playlists) => {
            console.log('seeded playlists');
            return knex('playlist_songs').insert([
              {playlist_id: playlists[0], song_id: songs[0]},
              {playlist_id: playlists[1], song_id: songs[1]},
              {playlist_id: playlists[2], song_id: songs[2]}
            ])
          })
          .catch((error) => console.log(`Error seeding playlists: ${error}`))
        })
        .catch((error) => console.log(`Error seeding songs: ${error}`)),
      ])
    })
    .catch(error => console.log(`Error deleting playlist_songs: ${error}`));
};
