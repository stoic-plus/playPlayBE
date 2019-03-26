const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const findBySongId = (id) => {
 return database('playlist_songs').select('song_id').where('song_id', id);
}

const deleteBySongId = (id) => {
  return database('playlist_songs').where('song_id', id).del()
}

module.exports = {
  findBySongId,
  deleteBySongId
}
