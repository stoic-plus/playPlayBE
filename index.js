const express = require("express");
const cors = require("./lib/routes/api/corsConfig").cors;
const corsOptions = require("./lib/routes/api/corsConfig").corsOptions;
const bodyParser = require("body-parser");
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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
