const express = require("express");
const routes = express.Router();
const sliderController = require("../controller/sliderController");

routes.get("/viewUserData", sliderController.viewUserData);

module.exports = routes;