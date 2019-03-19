module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/play',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  }
}
