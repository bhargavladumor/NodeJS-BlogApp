const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const imagePath = "/uploads/comments";

const commentSchema = mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        require : true
    },
    message : {
        type : String,
        required: true
    },
    userImage : {
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

commentSchema.statics.uploadCommentsImage = multer({storage : imageStorage}).single("userImage");
commentSchema.statics.imagePath = imagePath;

const Comments = mongoose.model("Comments",commentSchema);

module.exports = Comments;