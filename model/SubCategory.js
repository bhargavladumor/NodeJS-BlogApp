const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const imagePath = "/uploads/subCategory";

const subCatSchema = mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    desc : {
        type : String,
        required: true
    },
    catImage : {
        type : String,
        required: true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true 
    },
    isActive : {
        type : String,
        required: true
    },
    createdDate : {
        type : String,
        required: true
    },
    updatedDate : {
        type : String,
        required: true
    },
});

const imageStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imagePath))
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
})

subCatSchema.statics.uploadSubCategoryImage = multer({storage : imageStorage}).single("catImage");
subCatSchema.statics.imagePath = imagePath;

const SubCategory = mongoose.model("SubCategory",subCatSchema);

module.exports = SubCategory;