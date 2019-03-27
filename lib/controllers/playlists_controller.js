const Playlist = require('../models/playlist');
const Song = require('../models/song');
const PlaylistSong = require('../models/playlist_song');

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
  PlaylistSong.create(playlist_id, song_id)
  .then(() => {
     return Promise.all([
       Song.findByIdAndSelect(song_id, 'songs.name'),
       Playlist.findByIdAndSelect(playlist_id, 'playlists.name')
     ]);
  })
  .then((obj) => {
      response.status(201).json({ message: `Successfully added ${obj[0][0].name} to ${ obj[1][0].name}` });
  })
}

const deleteFavorite = (request, response) => {
  const playlist_id = request.params.playlist_id;
  const song_id = request.params.id;
  PlaylistSong.findByPlaylistId(playlist_id)
    .then((playlist) => {
      if (playlist.length === 0) {
        response.status(404).json({message: 'playlist not found by id'});
      } else {
        
      }
    })

}

module.exports = {
  index,
  createFavorite
};
