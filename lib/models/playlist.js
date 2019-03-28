const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allWithFavorites = () => {
  return database('playlists')
  .join('playlist_songs', {'playlists.id': 'playlist_songs.playlist_id'})
  .join('songs',{'songs.id': 'playlist_songs.song_id'})
  .select([
    'playlists.id as id',
    'playlists.name as name',
    database.raw("JSON_AGG(songs) as favorites")
  ])
  .groupBy('playlists.id')
}

const findByIdAndSelect = (id, column) => {
  return database('playlists').where('id', id).select(column);
}

module.exports = {
  allWithFavorites,
  findByIdAndSelect
};
