const Slider = require("../model/slider");
const fs = require("fs");
const path = require("path");

module.exports.addSlider = async (req,res) => {
    res.render("addSlider");
}

module.exports.insertSlider = async (req,res) => {
    try {

        let imgpath = "";
        if(req.file){
            imgpath = Slider.imagePath + "/" +req.file.filename;
            req.body.sliderImage = imgpath;
        } 
        else{
            console.log("File not found");
            res.redirect("back");
        }
        if(req.body){
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let data = await Slider.create(req.body);
            if(data){
                console.log("Inserted successfully");
            }
            else{
                console.log("Something wrong");
            }
        }
        else{
            console.log("Data not found")
            res.redirect("back");
        }
        res.redirect("back")

    } catch (error) {
        console.log("Something wrong" + error);
        res.redirect("back");
    }
}

module.exports.viewSlider = async (req,res) => {
    try{
        let adData = req.user;

        let search = '';
        let page = 0;

        if(req.query.page){
            page = req.query.page
        }
        let perPage = 2;

        if(req.query.search)
        {
            search = req.query.search;
        }
        if (adData) {
            let data = await Slider.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            })
            .limit(perPage)
            .skip(perPage*page);

            let totalDocumets = await Slider.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);

            if(data){
                res.render("viewSliderData",{
                    adData : data,
                    search : search,
                    totalPages : totalPages,
                    currentPage : page
                })
            }
        }
        else{
            console.log("No data found")
            res.redirect("/admin");
        }
    }
    catch(err){
        console.log("Something wrong "+err)
        res.redirect("back")
    }
}

module.exports.deleteMany = async (req,res) =>{
    try {
        if(req.body.deleteItems){
            let deletedData = await Slider.deleteMany({_id : {$in : req.body.deleteItems}});
            if(deletedData){
                console.log("Deleted successfully");
                res.redirect("back");
            }
            else{
                console.log("No data found");
                res.redirect("back");
            }
        }
        else{
            console.log("No data found");
            res.redirect("back");
        }

    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
}

module.exports.deactive = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Slider.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/slider/viewSlider")
            }
            else{
                console.log("Record not updated");
                res.redirect("back");
            }
        }
        else{
            console.log("Record not found");
            res.redirect("back");
        }
    } catch (error) {
        console.log("Record not found");
        res.redirect("back");
    }
}

module.exports.active = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Slider.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/slider/viewSlider")
            }
            else{
                console.log("Record not updated");
                res.redirect("back");
            }
        }
        else{
            console.log("Record not found");
            res.redirect("back");
        }
    } catch (error) {
        console.log("Record not found");
        res.redirect("back");
    }
}

module.exports.deleteData = async (req,res) => {
    try {
        if(req.params.id){
            let data = await Slider.findByIdAndDelete(req.params.id);
            fs.unlinkSync(path.join(__dirname,"..",data.sliderImage));
            if(data){
                res.redirect("/admin/slider/sliderData");
            }
        }
        else{
            console.log("Record not found")
            res.redirect("back");
        }
    } catch (error) {
        console.log("Something wrong");
        res.redirect("back");
    }
}

module.exports.updateData = async (req,res) => {
    try {
        
        let data = await Slider.findById(req.params.id);
        if(data){
            res.render("updateSlider",{
                adData : data,
                adminData : req.user
            })
        }
        else{
            console.log("Record not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong");
        res.redirect("back");
    }
}

module.exports.editSliderData = async (req,res) => {
    try {
        
        let data = await Slider.findById(req.body.thisId);
        if(req.file){
            let imgpath = req.file.filename;
            if(imgpath){
                fs.unlinkSync(path.join(__dirname,"..",data.sliderImage));
                req.body.sliderImage = Slider.imagePath+"/"+req.file.filename;
            }
        }
        else{
            req.body.sliderImage = data.sliderImage;
        }
        req.body.isActive = true;
        req.body.createdDate = new Date().toLocaleString();
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await Slider.findByIdAndUpdate(req.body.thisId, req.body);

        if(updatedData){
            res.redirect("viewSlider");
        }
        else{
            console.log("No slider updated");
            res.redirect("Back")
        }

    } catch (error) {
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}