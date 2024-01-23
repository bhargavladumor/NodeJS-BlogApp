const express = require("express");
const routes = express.Router();
const Comments = require("../model/Comments");
const commentController = require("../controller/commentController");

routes.post("/addComments", Comments.uploadCommentsImage ,commentController.addComments);

routes.get("/viewComments", commentController.viewComments);

module.exports = routes;