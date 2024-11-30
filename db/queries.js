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
  const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

  return rows[0];
};

async function getMessagesEmail(rows) {
  const messagesPromises = rows.map(async (message) => {
    const { rows } = await pool.query(`SELECT email FROM users WHERE id=$1`, [
      message.user_id,
    ]);
    const email = rows[0].email;
    return { ...message, email };
  });
  const messages = Promise.all(messagesPromises);

  return messages;
}

module.exports.getMessages = async (userStatus) => {
  const { rows } = await pool.query(
    `SELECT text, date, user_id, id FROM messages;`,
  );

  if (userStatus >= 2) {
    const messages = await getMessagesEmail(rows);
    return messages;
  }

  return rows;
};

module.exports.addMessage = async (message) => {
  await pool.query(
    `INSERT INTO messages (text, date, user_id) VALUES ($1, $2, $3)`,
    [message.text, message.date, message.userId],
  );
};

module.exports.upgradeToAdmin = async ({ userId }) => {
  await pool.query(`UPDATE users SET admin = true WHERE id=$1;`, [userId]);
};

module.exports.deleteMessage = async ({ messageId }) => {
  await pool.query(`DELETE FROM messages WHERE id=$1`, [messageId]);
};
