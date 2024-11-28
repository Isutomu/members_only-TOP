const { Router } = require("express");
const controllersGet = require("../controllers/controllers-get");
const controllersPost = require("../controllers/controllers-post");

const routes = Router();

routes.get("/sign-up", controllersGet.renderSignupForm);
routes.get("/join-the-club", controllersGet.renderJoinMembershipForm);

routes.post("/sign-up", controllersPost.addUser);
routes.post("/join-the-club", controllersGet.updateMembershipStatus);

module.exports = routes;
