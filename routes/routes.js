const { Router } = require("express");
const controllersGet = require("../controllers/controllers-get");
const controllersPost = require("../controllers/controllers-post");

const routes = Router();

routes.get("/sign-up", controllersGet.renderSignupForm);
routes.get("/join-the-club", controllersGet.renderJoinMembershipForm);
routes.get("/log-in", controllersGet.renderLoginForm);
routes.get("/", controllersGet.renderMessagesBoard);
routes.get("/admin-access", controllersGet.renderBecomeAdminForm);

routes.post("/sign-up", controllersPost.addUser);
routes.post("/join-the-club", controllersPost.updateMembershipStatus);
routes.post("/log-in", controllersPost.logIn);
routes.post("/createMessage", controllersPost.addMessage);
routes.post("/admin-access", controllersPost.updateAdminStatus);
routes.post("/delete-message", controllersPost.deleteMessage);

module.exports = routes;
