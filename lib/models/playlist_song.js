const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const findBySongId = (id) => {
 return database('playlist_songs').select('song_id').where('song_id', id);
}

const deleteBySongId = (id) => {
  return database('playlist_songs').where('song_id', id).del()
}

const create = (playlistId, songId) => {
  return database('playlist_songs').insert([
    {playlist_id: `${playlistId}`,
    song_id :`${songId}`}
  ])
}

module.exports = {
  findBySongId,
  deleteBySongId,
  create
}
