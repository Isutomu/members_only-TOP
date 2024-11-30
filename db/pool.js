const { Pool } = require("pg");

const CONNECTION_STRING = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString: CONNECTION_STRING,
  ssl: true,
});

module.exports = pool;
