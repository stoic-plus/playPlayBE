const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const pry = require("pryjs");
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'PlayPlay';

app.get('/', (request, response) => {
  response.send('Welcome To Play Play');
});

app.get('/api/v1/favorites', (request, response) => {
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
  // eval(pry.it);
  for (let requiredParameter of ['name', 'artist_name', 'rating', 'genre']) {
    eval(pry.it);
    if (!song[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <Sting>, rating: <Integer>}. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('songs').insert(song, 'id')
    .then(song => {
      response.status(201).json({ id: song[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
