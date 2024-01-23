const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const imagePath = "/uploads/post";

const postSchema = mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    title : {
        type : String,
        required: true
    },
    catagory : {
        type : String,
        required: true
    },
    desc : {
        type : String,
        required: true
    },
    postImage : {
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

postSchema.statics.uploadPostImage = multer({storage : imageStorage}).single("postImage");
postSchema.statics.imagePath = imagePath;

const Post = mongoose.model("Post",postSchema);

module.exports = Post;