const Admin = require("../model/Admin");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Dashboard 
module.exports.dashboard = async (req,res)=>{
        res.render("dashboard");
}

// User's information
module.exports.viewAdminData = async (req,res)=>{
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
            let data = await Admin.find({
                $or : [
                    {'name' : {$regex : `.*${search}.*` , $options : "i"}},
                    {'email' : {$regex : `.*${search}.*`, $options : "i"}}
                ]
            })
            .limit(perPage)
            .skip(perPage*page);

            let totalDocumets = await Admin.find({
                $or : [
                    {'name' : {$regex : `.*${search}.*` , $options : "i"}},
                    {'email' : {$regex : `.*${search}.*`, $options : "i"}}
                ]
            }).countDocuments();
            let totalPages = Math.ceil(totalDocumets/perPage);

            if(data){
                res.render("viewAdminData",{
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
        res.redirect("/admin/viewAdmindata")
    }
}


// Insert new user
module.exports.insertAdminData = async (req,res)=>{
    if(req.cookies.admin){
        res.render("insertAdminData")
    }
}
module.exports.createAdminData = async (req,res)=>{
    try {
        let imgpath = "";
        if(req.file){
            imgpath = Admin.imagePath + "/" +req.file.filename;
            req.body.adminImage = imgpath;
        } 
        else{
            console.log("File not found");
            res.redirect("back");
        }
        if(req.body){
            req.body.name = req.body.fname + " " + req.body.lname;
            req.body.isActive = true;
            req.body.createdDate = new Date().toLocaleString();
            req.body.updatedDate = new Date().toLocaleString();
            let data = await Admin.create(req.body);
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
        res.redirect("/admin/viewAdminData")
    } catch (error) {
        console.log("Something wrong");
        res.redirect("back");
    }
}

// Deactive users
module.exports.deactive = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Admin.findByIdAndUpdate(req.params.id, {isActive : false});
            if(record){
                res.redirect("/admin/viewAdminData")
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

// Active users
module.exports.active = async (req,res) => {
    try {
        if(req.params.id){
            let record = await Admin.findByIdAndUpdate(req.params.id, {isActive : true});
            if(record){
                res.redirect("/admin/viewAdminData")
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

// Delete user
module.exports.deleteData = async (req,res) => {
    try {
        if(req.params.id){
            let data = await Admin.findByIdAndDelete(req.params.id);
            fs.unlinkSync(path.join(__dirname,"..",data.adminImage));
            if(data){
                res.redirect("/admin/viewAdminData");
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

// Update user
module.exports.updateData = async (req,res) => {
    try {
        
        let data = await Admin.findById(req.params.id);
        if(data){
            res.render("updateAdminData",{
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
module.exports.editData = async (req,res) => {
    try {

        let data = await Admin.findById(req.body.thisId);
        if(req.file){
            let imgpath = req.file.filename;
            if(imgpath){
                fs.unlinkSync(path.join(__dirname,"..",data.adminImage));
                req.body.adminImage = Admin.imagePath+"/"+req.file.filename;
            }
        }
        else{
            req.body.adminImage = data.adminImage;
        }
        req.body.name = req.body.fname + " " + req.body.lname;
        req.body.isActive = true;
        req.body.createdDate = new Date().toLocaleString();
        req.body.updatedDate = new Date().toLocaleString();
        let updatedData = await Admin.findByIdAndUpdate(req.body.thisId, req.body);

        let temp = req.body;
        temp._id = req.body.thisId;
        temp.name = req.body.fname + req.body.lname;
        delete temp.thisId;
        delete temp.fname;
        delete temp.lname;

        if(updatedData){
            if(req.user.id == temp._id){
                req.user = temp;
                console.log("match");
                res.redirect("/admin/profile");
            }
            else{
                res.redirect("/admin/viewAdminData");
            }
        }
        else{
            console.log("Data not updated")
        }

    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
}


// Login
module.exports.login = async (req,res) =>{
    res.redirect("/admin/dashboard");
}

// Logout
module.exports.logout = async (req,res) =>{
    if(req.cookies.admin){
        res.clearCookie('admin');
        res.redirect("/admin");
    }
    else{
        console.log("Failed to logout")
        res.redirect("/admin/dashboard");
    }
}

// Change Password
module.exports.changePassword  = async (req,res) => {
    if(req.cookies.admin){
        res.render("changePassword",{
            adminData : req.user,
        });
    }
    else{
        console.log("Data not found");
        res.redirect("/admin");
    }
}
module.exports.editPassword = async (req,res) => {
    try{

        let data = await Admin.findById(req.user.id);
        if(data){
            if(req.body.cpass == data.password){
                if(req.body.cpass != req.body.npass){
                    if(req.body.npass == req.body.cmpass){
                        let updateData = await Admin.findByIdAndUpdate(data.id,{ password : req.body.npass });
                        if(updateData){
                            res.redirect("/admin/logout");
                        }
                        else{
                            console.log("Something wrong");
                            res.redirect("back");
                        }
                    }
                    else{
                        console.log("Both are not matching");
                        res.redirect("back");
                    }
                }
                else{
                    console.log("Both are same");
                    res.redirect("back");
                }
            }
            else{
                console.log("Invalid password");
                res.redirect("/admin/changePassword");
            }
        }else{
            console.log("Data not found");
            res.redirect("/admin/dashboard");
        }
    }catch(err){
        console.log("Data not found");
        res.redirect("/admin");
    }
}

// Profile
module.exports.profile = async (req,res) => {
    if(req.cookies.admin){
        res.render("profile",{
            adminData : req.user
        })
    }
    else{
        console.log("Something wrong");
        res.redirect("back");
    }
}

// Update Profile
module.exports.updateProfile = async (req,res) => {
    try {
        
        let data = await Admin.findById(req.params.id);
        if(data){
            res.render("updateAdminData",{
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

//---------- Forget password -------------- //


// Send email
module.exports.checkEmail = async (req,res) => {
    try {
        // From nodemailer
        let userData = await Admin.findOne({email : req.body.email});
        if(userData){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  user: "axyz44670@gmail.com",
                  pass: "pimpchlfhhbsmhzb",
                },
              });

              let otp = Math.floor(1000 + Math.random() * 9000);
              res.cookie("otp",otp);
              res.cookie("email",userData.email);

              const info = await transporter.sendMail({
                from: 'axyz44670@gmail.com', // sender address
                to: "bkladumor7@gmail.com", // list of receivers
                subject: "Forget password OTP", // Subject line
                html: `<h3>Dear ${userData.name},<br><br>To proceed with the password reset, we have generated a One-Time Password (OTP) that will allow you to create a new password securely.</h3>
                       <h2>Your OTP is: ${otp}</h2>`, // html body
            });
            console.log("Email sent");
            res.redirect("/admin/otpPage");
        }
        else{
            console.log("Data not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong, "+error);
        res.redirect("back");
    }

}

// check OTP
module.exports.checkOTP = async (req,res) => {
    try {
        let data = await Admin.findOne({email : req.cookies.email});
        if(data){
            if(req.cookies.otp == req.body.otp){
                res.clearCookie("otp");
                res.redirect("/admin/changeForgetPass");
            }
            else{
                console.log("OTP does not match");
                res.redirect("back");
            }
        }
        else{
            console.log("Data not found");
            res.redirect("back"); 
        }
    } catch (error) {
        console.log("Somethign wrong : "+error);
        res.redirect("back");
    }
}

module.exports.changeForgetPass = async (req,res) => {
    res.render("ForgetPass/changeForgetPass");   
}

module.exports.editForgetPass = async (req,res) => {
    try {
        
        let data = await Admin.findOne({email : req.cookies.email});
        if(data){
            if(req.body.npass == data.password){
                console.log("Same as old one.");
                res.redirect("back");
            }
            else{
                if(req.body.npass == req.body.cpass){
                    let updatePass = await Admin.findByIdAndUpdate(data.id,{password : req.body.npass});
                    if(updatePass){
                        console.log("Password Updated");
                        res.clearCookie("email");
                        res.redirect("/admin");
                    }
                    else{
                        console.log("data does not matched");
                        res.redirect("back");
                    }
                }
                else{
                    console.log("Password does not match");
                    res.redirect("back");
                }
            }
        }
        else{
            console.log("Data not found");
            res.redirect("back");
        }

    } catch (error) {
        console.log("Something wrong : "+error);
        res.redirect("back");
    }
}

// Delete many
module.exports.deleteMany = async (req,res) =>{
    try {
        
        if(req.body.deleteItems){
            let deletedData = await Admin.deleteMany({_id : {$in : req.body.deleteItems}});
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