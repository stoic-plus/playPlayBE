
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('songs', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('genre');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('playlists', function(table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('playlist_songs', function(table) {
      table.increments('id').primary();
      table.integer('playlist_id').unsigned();
      table.foreign('playlist_id').references('playlists.id');
      table.integer('song_id').unsigned();
      table.foreign('song_id').references('songs.id');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('playlist_songs'),
    knex.schema.dropTable('playlists'),
    knex.schema.dropTable('songs')
  ])
};
