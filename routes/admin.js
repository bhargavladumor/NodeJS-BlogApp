const express = require("express");
const routes = express.Router();
const adminController = require("../controller/adminController");
const Admin = require("../model/Admin");
const passport = require("passport");

routes.get("/", async (req,res)=>{
    if(req.isAuthenticated()){
        console.log("Already loggedIn");
        res.redirect("/admin/dashboard");
    }
    else{
        res.render("login");
    }
});

// Login
routes.post("/login", passport.authenticate('local',{failureRedirect : "/admin"}) ,adminController.login);

routes.get("/dashboard", passport.checkAuth ,adminController.dashboard);

// Logout
routes.get("/logout", adminController.logout);

// Insert record
routes.get("/insertAdminData", passport.checkAuth ,adminController.insertAdminData)
routes.post("/createAdminData", Admin.uploadAdminImage, adminController.createAdminData)

// View records
routes.get("/viewAdminData",passport.checkAuth ,adminController.viewAdminData);

// Soft delete
routes.get("/deactive/:id", adminController.deactive);
routes.get("/active/:id", adminController.active);

// Delete records
routes.get("/deleteData/:id", passport.checkAuth ,adminController.deleteData);

// Update records
routes.get("/updateData/:id", passport.checkAuth ,adminController.updateData);
routes.post("/editAdminData", Admin.uploadAdminImage , adminController.editData);

// Change password
routes.get("/changePassword", passport.checkAuth ,adminController.changePassword)
routes.post("/editPassword", adminController.editPassword);

// Profile
routes.get("/profile",passport.checkAuth , adminController.profile);

// Update Profile
routes.get("/updateProfile/:id", passport.checkAuth ,adminController.updateProfile);



//---------- Forget password -------------//

routes.get("/emailPage", async (req,res) => {
    return res.render("ForgetPass/emailPage");
});

// check email
routes.post("/checkEmail", adminController.checkEmail);

// send OTP
routes.get("/otpPage", async (req,res) => {
    return res.render("ForgetPass/otpPage")
})

// check OTP
routes.post("/checkOTP", adminController.checkOTP);

// Change password
routes.get("/changeForgetPass",adminController.changeForgetPass);
routes.post("/editForgetPass",adminController.editForgetPass);

// Delete Many
routes.post("/deleteMany", adminController.deleteMany);

// User
routes.use("/slider",passport.checkAuth,require("./slider"));

routes.use("/offer",passport.checkAuth,require("./offer"));

routes.use("/photos",passport.checkAuth,require("./photos"));

routes.use("/review",passport.checkAuth,require("./review"));

routes.use("/post",passport.checkAuth,require("./post"));

routes.use("/category",passport.checkAuth,require("./category"));

routes.use("/subCategory",passport.checkAuth,require("./subCategory"));

module.exports = routes;