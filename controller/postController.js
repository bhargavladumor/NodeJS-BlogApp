const Post = require("../model/post");
const fs = require("fs");
const path = require("path");

module.exports.addPost = (req,res) => {
    res.render("addPost");
}

module.exports.insertPost = async (req,res) => {
    try {
        
        let imgPath = "";
        if(req.file){
            imgPath = Post.imagePath + "/" + req.file.filename;
            req.body.postImage = imgPath;
        }
        else{
            console.log("File not found");
            res.redirect("back");
        }
        if(req.body){
            req.body.name = req.user.name;
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let data = await Post.create(req.body);
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

module.exports.viewPost = async (req,res) => {
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
            let data = await Post.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            })
            .limit(perPage)
            .skip(perPage*page);

            let totalDocumets = await Post.find({
                $or : [
                    {'title' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);

            if(data){
                res.render("viewPostData",{
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
            let deletedData = await Post.deleteMany({_id : {$in : req.body.deleteItems}});
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
            let record = await Post.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/post/viewPost")
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
            let record = await Post.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/post/viewPost")
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
            let data = await Post.findByIdAndDelete(req.params.id);
            fs.unlinkSync(path.join(__dirname,"..",data.sliderImage));
            if(data){
                res.redirect("/admin/post/viewPost");
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
        
        let data = await Post.findById(req.params.id);
        if(data){
            res.render("updatePost",{
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

module.exports.editPostData = async (req,res) => {
    try {
        
        let data = await Post.findById(req.body.thisId);
        if(req.file){
            let imgpath = req.file.filename;
            if(imgpath){
                fs.unlinkSync(path.join(__dirname,"..",data.postImage));
                req.body.postImage = Post.imagePath+"/"+req.file.filename;
            }
        }
        else{
            req.body.postImage = data.postImage;
        }
        req.body.isActive = true;
        req.body.createdDate = new Date().toLocaleString();
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await Post.findByIdAndUpdate(req.body.thisId, req.body);

        if(updatedData){
            res.redirect("viewPost");
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