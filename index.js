const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const pry = require("pryjs");
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const Song = require('./lib/models/song');
const Playlist = require('./lib/models/playlist');
const PlaylistSong = require('./lib/models/playlist_song');
const SongsController = require('./lib/controllers/songs_controller');

const whitelist = ['https://maddyg91.github.io', 'http://localhost:8080']
const corsOptions = {
  origin: function(origin, callback) {
     if(origin === undefined){
      callback(null, true);
    } else if (whitelist.indexOf(origin) === -1) {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
  optionsSuccessStatus: 200
}

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'PlayPlay';

app.get('/', cors(corsOptions), (request, response) => {
  response.send('Welcome To Play Play');
});

app.get('/api/v1/favorites', cors(corsOptions), SongsController.index);
app.post('/api/v1/favorites', SongsController.create);
app.put('/api/v1/favorites/:id', cors(corsOptions), SongsController.update);
app.get('/api/v1/favorites/:id', SongsController.show);

app.get('/api/v1/playlists', cors(corsOptions), (request, response) => {
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
});

app.delete('/api/v1/favorites/:id', cors(corsOptions), (request, response) => {
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
            database('songs').where('id', request.params.id).del()
              .then(() => {
                response.status(202).json({ message: 'succesfully deleted' });
              })
          });
      }
    })
    .catch(error => {
    })
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
