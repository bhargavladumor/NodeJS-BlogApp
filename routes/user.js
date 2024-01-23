const express = require("express");
const routes = express.Router();
const userController = require("../controller/userController")

routes.get("/", userController.home);

routes.get("/singlePost/:id",userController.singlePost);

routes.use("/workThree", userController.workThree);

module.exports = routes;