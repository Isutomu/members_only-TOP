const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const queries = require("../db/queries");
const passport = require("passport");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 15 characters.";
const lengthErrPassword = "must be between 6 and 12 characters.";
const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 15 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 15 })
    .withMessage(`Last name ${lengthErr}`),
  body("email").trim().isEmail().withMessage("Not a valid e-mail address."),
  body("confirmPassword")
    .trim()
    .isLength({ min: 6, max: 12 })
    .withMessage(`Password ${lengthErrPassword}`)
    .custom(async (confirmPassword, { req }) => {
      const password = req.body.password;
      if (password !== confirmPassword) {
        throw new Error("Passwords must be the same");
      }
    }),
];

module.exports.addUser = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email } = req.body;
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        nextTick(err);
        return res.status(400).render("sign-up-form", {
          errors: [err],
        });
      } else {
        await queries.addUser({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
      }
    });

    res.redirect("/");
  }),
];

const realSecretCode = "I want to join!";
const lengthErrSecretCode = "has between 8 and 15 characters.";
const validateSecretCode = [
  body("secretCode")
    .trim()
    .isLength({ min: 8, max: 15 })
    .withMessage(`The secret code ${lengthErrSecretCode}`)
    .custom(async (secretCode) => {
      if (realSecretCode !== secretCode) {
        throw new Error("Incorrect membership code!");
      }
    }),
];

module.exports.updateMembershipStatus = [
  validateSecretCode,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("join-membership-form", {
        errors: errors.array(),
      });
    }

    const userId = req.user.id;
    await queries.upgradeMembership({ userId });
    res.redirect("/");
  }),
];

module.exports.logIn = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  }),
];

const validateMessage = [body("newMessage").escape()];
module.exports.addMessage = [
  validateMessage,
  asyncHandler(async (req, res) => {
    const text = req.body.newMessage;
    const date = new Date();
    const userId = req.user.id;

    await queries.addMessage({ text, date, userId });

    res.redirect("/");
  }),
];

const realAdminSecretCode = "I am the chosen one!";
const lengthErrAdminSecretCode = "has between 15 and 22 characters.";
const validateAdminSecretCode = [
  body("secretCode")
    .trim()
    .isLength({ min: 15, max: 22 })
    .withMessage(`The secret code ${lengthErrAdminSecretCode}`)
    .custom(async (secretCode) => {
      if (realAdminSecretCode !== secretCode) {
        throw new Error("Incorrect Admin code!");
      }
    }),
];

module.exports.updateAdminStatus = [
  validateAdminSecretCode,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("become-admin-form", {
        errors: errors.array(),
      });
    }

    const userId = req.user.id;
    await queries.upgradeToAdmin({ userId });
    res.redirect("/");
  }),
];

module.exports.deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.body.messageId;
  await queries.deleteMessage({ messageId });

  res.redirect("/");
});
