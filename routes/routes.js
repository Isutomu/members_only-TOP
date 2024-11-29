const { Router } = require("express");
const controllersGet = require("../controllers/controllers-get");
const controllersPost = require("../controllers/controllers-post");
const passport = require("passport");

const routes = Router();

routes.get("/sign-up", controllersGet.renderSignupForm);
routes.get("/join-the-club", controllersGet.renderJoinMembershipForm);
routes.get("/log-in", controllersGet.renderLoginForm);

routes.post("/sign-up", controllersPost.addUser);
routes.post("/join-the-club", controllersPost.updateMembershipStatus);
routes.post("/log-in", controllersPost.logIn);

module.exports = routes;
