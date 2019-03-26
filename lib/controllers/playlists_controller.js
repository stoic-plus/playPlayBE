const Playlist = require('../models/playlist');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const index = (request, response) => {
  Playlist.allWithFavorites()
  .then((playlists) => {
    playlists.forEach(list => {
     list.favorites.forEach(fav => {
       delete fav.created_at;
       delete fav.updated_at;
     });
   });
    response.status(200).json({playlists});
  })
  .catch(error => {
    response.status(400).json({ error });
  });
}

const createFavorite = (request, response) => {
  const playlist_id = request.params.playlist_id;
  const song_id = request.params.id;
  database('playlist_songs').insert([
    {playlist_id: `${playlist_id}`,
    song_id :`${song_id}`}
  ])
  .then(() => {
     return Promise.all([database('songs').where({id: `${song_id}`}).select('songs.name'),
     database('playlists').where({id: `${playlist_id}`}).select('playlists.name')])
  })
  .then((obj) => {
      response.status(201).json({ message: `Successfully added ${obj[0][0].name} to ${ obj[1][0].name}` });
  })
}

module.exports = {
  index,
  createFavorite
};
