const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => {
  return database('songs').select().orderBy('id');
}

const create = (songParams) => {
  return database('songs').insert(songParams, ['id', 'name', 'artist_name', 'genre', 'rating']);
}

const findById = (id) => {
  return database('songs').where('id', id);
}

const deleteById = (id) => {
  return database('songs').where('id', id).del();
}

const update = (id, updatedAttributes) => {
  return database('songs').where('id', id).update(updatedAttributes, ['id', 'name', 'artist_name', 'genre', 'rating']);
}

module.exports = {
  all,
  create,
  findById,
  update,
  deleteById
};
