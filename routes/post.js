const express = require("express");

const routes = express.Router();

const Post = require("../model/post");

const postController = require("../controller/postController");

routes.get("/addPost", postController.addPost);

routes.post("/insertPost", Post.uploadPostImage , postController.insertPost);

routes.get("/viewPost", postController.viewPost);

routes.post("/deleteMany", postController.deleteMany);

routes.get("/deactive/:id", postController.deactive);
routes.get("/active/:id", postController.active);

routes.get("/deleteData/:id",postController.deleteData);

routes.get("/updateData/:id",postController.updateData);
routes.post("/editPostData", Post.uploadPostImage , postController.editPostData);


routes.use("/comments", require("./comment"));

module.exports = routes;