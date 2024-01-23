const express = require("express");

const routes = express.Router();

const offerController = require("../controller/offerController.js");
const Offer = require("../model/offer.js");

routes.get("/addOffer", offerController.addOffer);

routes.post("/insertOffer", offerController.insertOffer);

routes.get("/viewOffer", offerController.viewOffer);

routes.post("/deleteMany", offerController.deleteMany);

routes.get("/deactive/:id", offerController.deactive);
routes.get("/active/:id", offerController.active);

routes.get("/deleteData/:id",offerController.deleteData);

routes.get("/updateData/:id",offerController.updateData);
routes.post("/editOfferData", offerController.editOfferData);

module.exports = routes;