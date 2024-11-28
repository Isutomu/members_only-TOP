const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const queries = require("../db/queries");

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
