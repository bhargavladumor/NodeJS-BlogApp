const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const imagePath = "/uploads/slider";

const sliderSchema = mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    desc : {
        type : String,
        required: true  
    },
    link : {
        type : String,
        required: true
    },
    sliderImage : {
        type : String,
        required: true
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

sliderSchema.statics.uploadSliderImage = multer({storage : imageStorage}).single("sliderImage");
sliderSchema.statics.imagePath = imagePath;

const Slider = mongoose.model("Slider",sliderSchema);

module.exports = Slider;