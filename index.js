const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const pry = require("pryjs");
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

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

app.get('/api/v1/favorites', cors(corsOptions), (request, response) => {
  database('songs').select()
    .then((songs) => {
      response.status(200).json(songs);
    })
    .catch(error => {
      response.status(400).json({error});
    })
});

app.post('/api/v1/favorites', (request, response) => {
  const song = request.body;
  for (let requiredParameter of ['name', 'artist_name', 'rating', 'genre']) {
    if (!song[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <Sting>, rating: <Integer>}. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('songs').insert(song, ['id', 'name', 'artist_name', 'genre', 'rating'])
    .then(song => {
      response.status(201).json({favorites: song[0]})
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  });


app.put('/api/v1/favorites/:id', cors(corsOptions), (request, response) => {
  database('songs').where('id', request.params.id)
    .update(request.body, ['id', 'name', 'artist_name', 'genre', 'rating'])
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
});

app.get('/api/v1/favorites/:id', cors(corsOptions), (request, response) => {
  database('songs').where('id', request.params.id)
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
});

app.get('/api/v1/playlists', cors(corsOptions), (request, response) => {
  database('playlists')
  .join('playlist_songs', {'playlists.id': 'playlist_songs.playlist_id'})
  .join('songs',{'songs.id': 'playlist_songs.song_id'})
  .select([
    'playlists.id as playId',
    'playlists.name as playName',
    database.raw('ARRAY_AGG(songs.name) as songs')
  ])
  .groupBy('playlists.id', 'playlist_songs.id', 'songs.id')
  .then((playlists) => {
    eval(pry.it);
  })
  .then((playlists) => {
      eval(pry.it);
    response.status(200).json({playlists});
  })
  .catch(error => {
      eval(pry.it);
    response.status(400).json({ error });
  });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
