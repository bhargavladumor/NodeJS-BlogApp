const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    desc : {
        type : String,
        required: true
    },
    country : {
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

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;