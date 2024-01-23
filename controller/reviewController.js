const Review = require("../model/review");

module.exports.addReview = async (req,res) => {
    res.render("addReview");
}

module.exports.insertReview = async (req,res) => {
    try {
        
        if(req.body){
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let data = await Review.create(req.body);
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

module.exports.viewReview = async (req,res) => {
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
            let data = await Review.find({
                $or : [
                    {'name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            })
            .limit(perPage)
            .skip(perPage*page);

            let totalDocumets = await Review.find({
                $or : [
                    {'name' : {$regex : `.*${search}.*` , $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);

            if(data){
                res.render("viewReview",{
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
            let deletedData = await Review.deleteMany({_id : {$in : req.body.deleteItems}});
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
            let record = await Review.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/review/viewReview")
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
            let record = await Review.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/review/viewReview")
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
            let data = await Review.findByIdAndDelete(req.params.id);
            if(data){
                res.redirect("/admin/review/viewReview");
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
        
        let data = await Review.findById(req.params.id);
        if(data){
            res.render("updateReview",{
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

module.exports.editReviewData = async (req,res) => {
    try {
        
        let data = await Review.findById(req.body.thisId);
        if(data){
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let updatedData = await Review.findByIdAndUpdate(req.body.thisId, req.body);
            if(updatedData){
                res.redirect("viewReview");
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