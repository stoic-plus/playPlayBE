const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const findBySongId = (id) => {
 return database('playlist_songs').select('song_id').where('song_id', id);
}

const findByIds = (playlist_id, song_id) => {
  return database('playlist_songs')
    .select('playlist_id', 'song_id')
    .where({
      playlist_id: playlist_id,
      song_id: song_id
    });
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
  findByIds,
  deleteBySongId,
  create
}
