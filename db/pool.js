const { Pool } = require("pg");

const CONNECTION_STRING = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString: CONNECTION_STRING,
});

module.exports = pool;
