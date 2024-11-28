const { Router } = require("express");
const controllersGet = require("../controllers/controllers-get");
const controllersPost = require("../controllers/controllers-post");

const routes = Router();

routes.get("/sign-up", controllersGet.renderSignupForm);

routes.post("/sign-up", controllersPost.addUser);

module.exports = routes;
