module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/play',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  },
  production: {
    client: 'pg',
    connection: 'postgres://kclgznvrbevnhw:8a1a11ba180e99b9791379e4f530e6db0f309b0256f5fd6b542dcaa173c51bae@ec2-54-197-232-203.compute-1.amazonaws.com:5432/d97o2lvbdi0f6l',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/prod'
    }
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/play_test',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  }
}
