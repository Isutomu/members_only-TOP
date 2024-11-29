require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const pgStore = require("connect-pg-simple")(session);
const passport = require("passport");
const routes = require("./routes/routes");

// General setup
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup
const sessionStore = new pgStore({
  conString: process.env.CONNECTION_STRING,
  tableName: "session",
  createTableIfMissing: true,
});
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

// Passport authentication
require("./config/passport");
app.use(passport.session());

// Routes
app.use("/", routes);

// Server
app.listen(PORT, () => console.log(`Server initialized on port ${PORT}.`));
