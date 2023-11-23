const express = require("express");
const routes = express.Router();
const userController = require("../controller/userController")

routes.get("/", userController.home);

module.exports = routes;