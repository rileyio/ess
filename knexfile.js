require("dotenv").config();

const MYSQL = {
  /**
   * mysql2
   **/
  client: "mysql2",
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
    directory: "./migrations/",
    tableName: "knex_migrations"
  },
  seeds: {
    directory: "./db/seeds/"
  }
};

const SQLITE = {
  /**
   * sqlite3
   **/
  client: "sqlite3",
  connection: {
    filename: `${process.env.DB_NAME}.sqlite`
  },
  migrations: {
    directory: "./migrations/",
    tableName: "knex_migrations"
  },
  seeds: {
    directory: "./db/seeds/"
  },
  useNullAsDefault: true
};

/**
 * Determine on file call which databse to return
 */
console.log(`Checking DB type defined = ${process.env.DB_TYPE}`)

switch (process.env.DB_TYPE.toLocaleLowerCase()) {
  case 'mysql2':
    module.exports = MYSQL;
    break;

  default:
    module.exports = SQLITE;
    break;
}
