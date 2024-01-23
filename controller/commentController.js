const Comment = require("../model/Comments");

module.exports.addComments = async (req,res) => {
    try {

        let imgPath = "";
        if(req.file){
            imgPath = Comment.imagePath+"/"+req.file.filename;
        }
        req.body.userImage = imgPath;
        req.body.isActive = true;
        req.body.createdDate = new Date().toLocaleString();
        req.body.updatedDate = new Date().toLocaleString();
        let data = await Comment.create(req.body);
        if(data){
            res.redirect("back");
        }
        else{
            console.log("Something wrong " );
            res.redirect("back");
        }
        
    } catch (error) {
        console.log("Something wrong "+error );
        res.redirect("back");
    }
}

module.exports.viewComments = async (req,res) => {
    try {
        let cmData = await Comment.find({}).populate("postId").exec();
        if(cmData){
            res.render("viewComments",{
                cmData : cmData
            });
        }

    } catch (error) {
        console.log("Somthing wrong "+error);
        res.redirect("back");
    }
}