const express = require("express");
const cors = require("./lib/routes/api/corsConfig").cors;
const corsOptions = require("./lib/routes/api/corsConfig").corsOptions;
const bodyParser = require("body-parser");

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const songs = require("./lib/routes/api/v1/songs");
const playlists = require("./lib/routes/api/v1/playlists");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.use('/api/v1/favorites', songs);
app.use('/api/v1/playlists', playlists);
app.locals.title = 'PlayPlay';

app.get('/', cors(corsOptions), (request, response) => {
  response.send('Welcome To Play Play');
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
app.post('/api/v1/playlists/:playlist_id/favorites/:id', cors(corsOptions), (request, response) => {
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
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
