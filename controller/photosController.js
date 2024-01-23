const Photos = require("../model/photos");
const fs = require("fs");
const path = require("path");

module.exports.addPhotos = (req,res) => {
    res.render("addPhotos");
}

module.exports.insertPhotos = async (req,res) => {
    try {
        
        let imgPath = "";
        if(req.file){
            imgPath = Photos.imagePath + "/" + req.file.filename;
            req.body.photosImage = imgPath;
        }
        else{
            console.log("File not found");
            res.redirect("back");
        }
        if(req.body){
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let data = await Photos.create(req.body);
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
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}

module.exports.viewPhotos = async (req,res) => {
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
            let data = await Photos.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            })
            .limit(perPage)
            .skip(perPage*page);

            let totalDocumets = await Photos.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);

            if(data){
                res.render("viewPhotosData",{
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
            let deletedData = await Photos.deleteMany({_id : {$in : req.body.deleteItems}});
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
            let record = await Photos.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/photos/viewPhotos")
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
            let record = await Photos.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/photos/viewPhotos")
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
            let data = await Photos.findByIdAndDelete(req.params.id);
            fs.unlinkSync(path.join(__dirname,"..",data.photosImage));
            if(data){
                res.redirect("/admin/photos/viewPhotos");
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
        
        let data = await Photos.findById(req.params.id);
        if(data){
            res.render("updatePhotos",{
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

module.exports.editPhotosData = async (req,res) => {
    try {
        
        let data = await Photos.findById(req.body.thisId);
        if(req.file){
            let imgpath = req.file.filename;
            if(imgpath){
                fs.unlinkSync(path.join(__dirname,"..",data.photosImage));
                req.body.photosImage = Photos.imagePath+"/"+req.file.filename;
            }
        }
        else{
            req.body.photosImage = data.photosImage;
        }
        req.body.isActive = true;
        req.body.createdDate = new Date().toLocaleString();
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await Photos.findByIdAndUpdate(req.body.thisId, req.body);

        if(updatedData){
            res.redirect("viewPhotos");
        }
        else{
            console.log("No photos updated");
            res.redirect("Back")
        }

    } catch (error) {
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}