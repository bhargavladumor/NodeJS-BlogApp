const express = require("express");
const port = 8080;
const path = require("path");
const app = express();
const db = require("./config/db");
const Admin = require("./model/Admin");
const cookieParser = require("cookie-parser");

const session = require("express-session");
const passport = require("passport");
const localStratagy = require("./config/passport-local");

app.use(cookieParser());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"assets")));
app.use(express.static(path.join(__dirname,"user_assets")));
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use(express.urlencoded());

app.use(session({
    name : "admin",
    secret : "admin",
    resave : false,
    saveUninitialized : false,
    cookie : { maxAge : 1000*60*10 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuth);

app.use("/admin",require("./routes/admin"));
app.use("/",require("./routes/user"));

app.listen(port,(err)=>{
    if(err){
        console.log("Something wrong");
    }
    console.log(`App is running on port ${port}`);
})