require("dotenv").config();
const { Client } = require("pg");

const INSTALL_PG_CRYPTO = 'CREATE EXTENSION IF NOT EXISTS "pgcrypto";';
const CREATE_TABLE_USERS = `
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR ( 255 ),
    last_name VARCHAR ( 255 ),
    email VARCHAR ( 255 ),
    password VARCHAR ( 255 ),
    membership_status BOOLEAN NOT NULL DEFAULT false,
    admin BOOLEAN NOT NULL DEFAULT false
);
`;
const CREATE_TABLE_MESSAGES = `
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text VARCHAR ( 300 ),
    date TIMESTAMPTZ,
    user_id VARCHAR ( 255 )
);
`;
const CONNECTION_STRING = process.argv[2] || process.env.CONNECTION_STRING;

async function create_tables(client) {
  await client.query(CREATE_TABLE_USERS);
  await client.query(CREATE_TABLE_MESSAGES);
}

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: CONNECTION_STRING,
  });

  await client.connect();
  await client.query(INSTALL_PG_CRYPTO);
  await create_tables(client);
  await client.end();

  console.log("seeding done!");
}

main();
