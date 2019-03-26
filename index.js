const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const pry = require("pryjs");
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const Playlist = require('./lib/models/playlist');
const PlaylistSong = require('./lib/models/playlist_song');
const Song = require('./lib/models/song');
const SongsController = require('./lib/controllers/songs_controller');
const PlaylistController = require('./lib/controllers/playlists_controller');

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

app.get('/api/v1/playlists', cors(corsOptions), PlaylistController.index);

app.delete('/api/v1/favorites/:id', cors(corsOptions), SongsController.deleteById);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
