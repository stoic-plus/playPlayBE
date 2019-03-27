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
  PlaylistSong.findByIds(playlist_id, song_id)
    .then((playlist) => {
      if (playlist.length === 0) {
        Song.findByIdAndSelect(song_id, 'songs.name')
          .then((song) => {
            if (song.length === 0) {
              response.status(404).json({message: 'favorite not found'});
            } else {
              Playlist.findByIdAndSelect(playlist_id, 'playlists.name')
                .then((playlist) => {
                  if (playlist.length === 0) {
                    response.status(404).json({message: `playlist not found`});
                  } else {
                    response.status(404).json({message: `${song[0].name} does not belong to requested playlist`});
                  }
                })
            }
          })
      } else {
        Promise.all([
          Song.findByIdAndSelect(song_id, 'songs.name'),
          Playlist.findByIdAndSelect(playlist_id, 'playlists.name')
        ])
        .then((names) => {
          response.status(202).json({ message: `Successfully removed ${names[0][0].name} from ${ names[1][0].name}` });
        })
      }
    })
}

module.exports = {
  index,
  createFavorite,
  deleteFavorite
};
