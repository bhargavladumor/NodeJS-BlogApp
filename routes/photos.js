const express = require("express");

const routes = express.Router();

const Photos = require("../model/photos.js");

const photosController = require("../controller/photosController.js");

routes.get("/addPhotos", photosController.addPhotos);

routes.post("/insertPhotos", Photos.uploadPhotoImage , photosController.insertPhotos);

routes.get("/viewPhotos", photosController.viewPhotos);

routes.post("/deleteMany", photosController.deleteMany);

routes.get("/deactive/:id", photosController.deactive);
routes.get("/active/:id", photosController.active);

routes.get("/deleteData/:id",photosController.deleteData);

routes.get("/updateData/:id",photosController.updateData);
routes.post("/editPhotosData", Photos.uploadPhotoImage , photosController.editPhotosData);

module.exports = routes;