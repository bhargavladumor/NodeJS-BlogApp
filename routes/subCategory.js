const express = require("express");
const routes = express.Router();
const SubCategory = require("../model/SubCategory");
const subCategoryController = require("../controller/subCategoryController");

routes.get("/addSubCategory", subCategoryController.addSubCategory);

routes.post("/insertSubCategory", SubCategory.uploadSubCategoryImage , subCategoryController.insertSubCategory);

routes.get("/viewSubCategory", subCategoryController.viewSubCat);

routes.post("/deleteMany", subCategoryController.deleteMany);

routes.get("/deactive/:id", subCategoryController.deactive);
routes.get("/active/:id", subCategoryController.active);

routes.get("/deleteData/:id",subCategoryController.deleteData);

routes.get("/updateData/:id",subCategoryController.updateData);
routes.post("/editSubCatData", SubCategory.uploadSubCategoryImage , subCategoryController.editSubCatData);

module.exports = routes;