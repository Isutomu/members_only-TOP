const asyncHandler = require("express-async-handler");
const queries = require("../db/queries");

module.exports.renderSignupForm = (req, res) => {
  res.render("sign-up-form");
};

module.exports.renderJoinMembershipForm = (req, res) => {
  res.render("join-membership-form");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("log-in-form");
};

/**
 * Determines the clearance level of a user based in their login status and membership access.
 * @param {object} user - The user object from the session.
 * @returns {number} Can be 0 (visitor), 1 (logged), 2 (logged and is member) or 3 (admin).
 */
async function getUserClearance(userId) {
  if (!userId) {
    return 0;
  }

  const { membership_status, admin } = await queries.getUserById(userId);
  return admin ? 3 : membership_status ? 2 : 1;
}

module.exports.renderMessagesBoard = asyncHandler(async (req, res) => {
  const userStatus = await getUserClearance(req.user?.id);
  const messages = await queries.getMessages(userStatus);

  res.render("homepage", { messages, userStatus });
});

module.exports.renderBecomeAdminForm = (req, res) => {
  res.render("become-admin-form");
};
