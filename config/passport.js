const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const queries = require("../db/queries");
const bcrypt = require("bcryptjs");

const authStrategy = new LocalStrategy(async (email, password, done) => {
  try {
    const user = await queries.getUserByEmail(email);

    if (!user) {
      return done(null, false, { message: "No account with this e-mail." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password!" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(authStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await queries.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
