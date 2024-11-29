const pool = require("./pool");

module.exports.addUser = async ({ firstName, lastName, email, password }) => {
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`,
    [firstName, lastName, email, password],
  );
};

module.exports.upgradeMembership = async ({ userId }) => {
  await pool.query(`UPDATE users SET membership_status = true WHERE id=$1;`, [
    userId,
  ]);
};

module.exports.getUserByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT id, email, password FROM users WHERE email=$1`,
    [email],
  );

  return rows[0];
};

module.exports.getUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, email, password FROM users WHERE id=$1`,
    [id],
  );

  return rows[0];
};
