const Slider = require("../model/slider");
const Offer = require("../model/offer");
const Photos = require("../model/photos");
const Review = require("../model/review");
const Post = require("../model/post");
const Comment = require("../model/Comments");
const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");

module.exports.home = async (req,res) => { 
    let data = await Slider.find({});
    let data2 = await Offer.find({});
    let data3 = await Photos.find({});
    let data4 = await Review.find({});
    let data5 = await Post.find({});
    console.log(data)
    res.render("userPanel/home",{
        sliderData : data,
        offerData : data2,
        photosData : data3,
        reviewData : data4,
        postData : data5
    });
}

module.exports.singlePost = async (req,res) => {
    try {
        
        let data = await Post.findById(req.params.id)
        let cmData = await Comment.find({postId : req.params.id });

        let allIds = [];
        let allPosts = await Post.find({});
        allPosts.map((v)=>{
            allIds.push(v.id);
        });

        // Next / Prev comments
        let currentPos = '';
        for(let i = 0; i<allIds.length; i++){
            if(allIds[i] == req.params.id){
                currentPos = i;
                break;
            }
        }

        // Recent posts
        let recentPosts = await Post.find({}).sort({"_id":-1}).limit(3);

        if(data){
            res.render("userPanel/singlePost",{
                postData : data,
                postId : req.params.id,
                cmData : cmData,
                allPosts : allPosts,
                currentPos : currentPos,
                recentPosts : recentPosts
            })
        }
        else{
            console.log("Data not found");
            res.redirect("back");
        }
        
    } catch (error) {
        console.log("Something wrong");
        res.redirect("back");
    }
}

module.exports.workThree = async (req,res) => {
    try {
        
        let catData = await Category.find({});
        let subcatData = await SubCategory.find({});
        res.render("userPanel/workThree",{
            catData : catData,
            subcatData : subcatData
        })
        

    } catch (error) {
        console.log("Something wrong "+error);
        res.redirect("back");
    }
}