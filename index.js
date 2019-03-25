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
  database('songs').select().orderBy('id')
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
    'playlists.id as id',
    'playlists.name as name',
    database.raw("JSON_AGG(songs) as favorites")
  ])
  .groupBy('playlists.id', 'playlist_songs.id', 'songs.id')
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
  database('playlist_songs').select('song_id').where('song_id', request.params.id)
    .then((playsong) => {
      if (playsong.length === 0) {
        database('songs').select('id').where('id', request.params.id)
          .then((song) => {
            if (song.length === 0) {
              response.status(400).json({ message: 'favorite not found by id' });
            } else {
              database('songs').where('id', request.params.id).del()
                .then(() => {
                  response.status(202).json({ message: 'succesfully deleted' });
                })
            }
          })
      } else {
        database('playlist_songs').where('song_id', request.params.id).del()
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
