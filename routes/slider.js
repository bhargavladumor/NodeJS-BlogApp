const express = require("express");

const routes = express.Router();

const Slider = require("../model/slider");

const sliderController = require("../controller/sliderController");

routes.get("/addSlider", sliderController.addSlider);

routes.post("/insertSlider", Slider.uploadSliderImage , sliderController.insertSlider);

routes.get("/viewSlider", sliderController.viewSlider);

routes.post("/deleteMany", sliderController.deleteMany);

routes.get("/deactive/:id", sliderController.deactive);
routes.get("/active/:id", sliderController.active);

routes.get("/deleteData/:id",sliderController.deleteData);

routes.get("/updateData/:id",sliderController.updateData);
routes.post("/editSliderData", Slider.uploadSliderImage , sliderController.editSliderData);



module.exports = routes;