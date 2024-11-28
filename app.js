require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const pgStore = require("connect-pg-simple")(session);
const routes = require("./routes/routes");

const PORT = process.env.port || 8080;
const app = express();
const sessionStore = new pgStore({
  conString: process.env.CONNECTION_STRING,
  tableName: "session",
  createTableIfMissing: true,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.listen(PORT, () => console.log(`Server initialized on port ${PORT}.`));
