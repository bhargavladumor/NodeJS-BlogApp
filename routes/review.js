const express = require("express");

const routes = express.Router();

const reviewController = require("../controller/reviewController.js");

routes.get("/addReview", reviewController.addReview);

routes.post("/insertReview", reviewController.insertReview);

routes.get("/viewReview", reviewController.viewReview);

routes.post("/deleteMany", reviewController.deleteMany);

routes.get("/deactive/:id", reviewController.deactive);
routes.get("/active/:id", reviewController.active);

routes.get("/deleteData/:id",reviewController.deleteData);

routes.get("/updateData/:id",reviewController.updateData);
routes.post("/editReviewData", reviewController.editReviewData);

module.exports = routes;