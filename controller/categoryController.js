const Category = require("../model/Category");

module.exports.addCategory = async (req,res) => {
    res.render("addCategory");
}

module.exports.insertCategory = async (req,res) => {
    try {

        if(req.body){
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let data = await Category.create(req.body);
            if(data){
                res.redirect("back");
            }
            else {
                console.log("Something wrong");
                res.redirect("back");
            }
        }
        else {
            console.log("Something wrong");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}

module.exports.viewCategory = async (req,res) => {
    try{
        let adData = req.user;

        let search = '';
        let page = 0;

        if(req.query.page){
            page = req.query.page
        }
        let perPage = 4;

        if(req.query.search)
        {
            search = req.query.search;
        }
        if (adData) {
            let data = await Category.find({
                $or : [
                    {'category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            })
            .limit(perPage)
            .skip(perPage*page);

            let totalDocumets = await Category.find({
                $or : [
                    {'category_name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);

            if(data){
                res.render("viewCategory",{
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
            let deletedData = await Category.deleteMany({_id : {$in : req.body.deleteItems}});
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
            let record = await Category.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/category/viewCategory")
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
            let record = await Category.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/category/viewCategory")
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
            let data = await Category.findByIdAndDelete(req.params.id);
            if(data){
                res.redirect("/admin/category/viewCategory");
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
        
        let data = await Category.findById(req.params.id);
        if(data){
            res.render("updateCategory",{
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

module.exports.editCategoryData = async (req,res) => {
    try {
        
        let data = await Category.findById(req.body.thisId);
        if(data){
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let updatedData = await Category.findByIdAndUpdate(req.body.thisId, req.body);
            if(updatedData){
                res.redirect("viewCategory");
            }
            else{
                console.log("No Offer updated");
                res.redirect("Back")
            }
        }


    } catch (error) {
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}