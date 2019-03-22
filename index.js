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
    if (whitelist.indexOf(origin) === -1) {
      callback(new Error('Not allowed bt CORS'));
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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
