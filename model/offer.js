const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({
    icon : {
        type : String,
        required: true
    },
    title : {
        type : String,
        required: true
    },
    desc : {
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

const Offer = mongoose.model("Offer",offerSchema);

module.exports = Offer;