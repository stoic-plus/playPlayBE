const Song = require('../models/song');
const PlaylistSong = require('../models/playlist_song');

const index = (request, response) => {
  Song.all()
    .then((songs) => {
      response.status(200).json(songs);
    })
    .catch(error => {
      response.status(400).json({error});
    });
}

const create = (request, response) => {
  const songParams = request.body;
  for (let requiredParameter of ['name', 'artist_name', 'rating', 'genre']) {
    if (!songParams[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <Sting>, rating: <Integer>}. You're missing a "${requiredParameter}" property.` });
    }
  }

  Song.create(songParams)
    .then(song => {
      response.status(201).json({favorites: song[0]})
    })
    .catch(error => {
      response.status(500).json({ error });
    });
}

const update = (request, response) => {
  Song.update(request.params.id, request.body)
    .then((updatedSong) => {
      if (updatedSong.length === 0) {
        response.status(400).json({message: "favorite not found"});
      } else {
        response.status(200).json({favorites: updatedSong[0]});
      }
    })
    .catch(error => {
      response.status(400).json({error});
    });
}

const show = (request, response) => {
  Song.findById(request.params.id)
  .then((favoritesong) => {
    if(favoritesong.length === 0) {
        response.status(400).json({message: "favorite with id not found"});
    } else {
        response.status(200).json({favorites: favoritesong[0]});
    }
  })
  .catch(error => {
    response.status(400).json({message: 'favorite not found'});
  });
}

const deleteById = (request, response) => {
  PlaylistSong.findBySongId(request.params.id)
    .then((playsong) => {
      if (playsong.length === 0) {
        Song.findById(request.params.id)
          .then((song) => {
            if (song.length === 0) {
              response.status(400).json({ message: 'favorite not found by id' });
            } else {
              Song.deleteById(request.params.id)
                .then(() => {
                  response.status(202).json({ message: 'succesfully deleted' });
                })
            }
          })
      } else {
        PlaylistSong.deleteBySongId(request.params.id)
          .then(() => {
            Song.deleteById(request.params.id)
              .then(() => {
                response.status(202).json({ message: 'succesfully deleted' });
              })
          });
      }
    })
    .catch(error => {
    })
}

module.exports = {
  index,
  create,
  update,
  show,
  deleteById
}
