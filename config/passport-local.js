const passport = require("passport");

const localStratagy = require("passport-local").Strategy;

const Admin = require("../model/Admin");

passport.use(new localStratagy({
    usernameField : "email"
},async function (email,password,done){
    
    let adminData = await Admin.findOne({email : email});
    if(adminData){
        if(adminData.password == password){
            return done(null,adminData);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }

}))

passport.serializeUser(async (user,done) => {
    return done(null,user.id);
})

passport.deserializeUser(async (id,done) => {
    let adminData = await Admin.findById(id);
    if(adminData){
        return done(null,adminData);
    }
    else{
        return done(null,false);
    }
})

passport.setAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        // To store data in session
        res.locals.user = req.user;
    }
    next();
}

passport.checkAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.redirect("/admin");
    }
}

module.exports = passport;