require('dotenv').config()

module.exports = {
  /** 
   * mysql2 
   **/
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations/',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './db/seeds/'
  },
  /** 
   * sqlite3 
   **/
  client: 'sqlite3',
  connection: {
    filename: `${process.env.DB_NAME}.sqlite`
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations/',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './db/seeds/'
  }
}
