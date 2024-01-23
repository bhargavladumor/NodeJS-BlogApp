const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const fs = require("fs");
const path = require("path");

module.exports.addSubCategory = async (req,res) => {
    try {
        
        let categoryData = await Category.find({});
        res.render("addSubCategory",{
            category : categoryData
        });

    } catch (error) {
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}

module.exports.insertSubCategory = async (req,res) => {
    try {
        
        let imgPath = "";
        if(req.file){
            imgPath = SubCategory.imagePath + "/" + req.file.filename;
            req.body.catImage = imgPath;
        }
        else{
            console.log("File not found");
            res.redirect("back");
        }
        if(req.body){
            req.body.categoryId = req.body.category;
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            console.log(req.body)
            let data = await SubCategory.create(req.body);
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

module.exports.viewSubCat = async (req,res) => {
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
            let data = await SubCategory.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).populate("categoryId")
            .limit(perPage)
            .skip(perPage*page).exec();

            let totalDocumets = await Category.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);

            if(data){
                console.log(data)
                res.render("viewSubCat",{
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
            let deletedData = await SubCategory.deleteMany({_id : {$in : req.body.deleteItems}});
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
            let record = await SubCategory.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/subCategory/viewSubCategory")
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
            let record = await SubCategory.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/subCategory/viewSubCategory")
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
            let data = await SubCategory.findByIdAndDelete(req.params.id);
            fs.unlinkSync(path.join(__dirname,"..",data.catImage));
            if(data){
                res.redirect("/admin/subCategory/viewSubCategory");
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
        
        let data = await SubCategory.findById(req.params.id);
        let Catdata = await Category.find({});
        if(data){
            res.render("updateSubCat",{
                adData : data,
                Catdata : Catdata,
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

module.exports.editSubCatData = async (req,res) => {
    try {
        
        let data = await SubCategory.findById(req.body.thisId);
        if(req.file){
            let imgpath = req.file.filename;
            if(imgpath){
                fs.unlinkSync(path.join(__dirname,"..",data.catImage));
                req.body.catImage = SubCategory.imagePath+"/"+req.file.filename;
            }
        }
        else{
            req.body.catImage = data.catImage;
        }
        req.body.categoryId = data.categoryId;
        req.body.isActive = true;
        req.body.createdDate = new Date().toLocaleString();
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await SubCategory.findByIdAndUpdate(req.body.thisId, req.body);

        if(updatedData){
            res.redirect("viewSubCategory");
        }
        else{
            console.log("No post updated");
            res.redirect("Back")
        }

    } catch (error) {
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}