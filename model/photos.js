const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const imagePath = "/uploads/photos";

const photoSchema = mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    desc : {
        type : String,
        required: true
    },
    photosImage : {
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

photoSchema.statics.uploadPhotoImage = multer({storage : imageStorage}).single("photosImage");
photoSchema.statics.imagePath = imagePath;

const Photos = mongoose.model("Photos",photoSchema);

module.exports = Photos;