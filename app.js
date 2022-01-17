require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express()
app.use(express.static('public'));
app.set('veiwengine', ejs);
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'This-is-a-secret-string',
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());

//mongoose
mongoose.connect('mongodb://localhost:27017/userDB')
const userSchema = new mongoose.Schema({email: String, password: String});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

//passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req,res)=>{
    res.render('home.ejs');
});

app.get("/login", (req,res)=>{
    res.render('login.ejs');
});

app.get("/secrets", (req,res)=>{
    if (req.isAuthenticated()){
        res.render("secrets.ejs");
    } else{
        res.redirect("/login");
    }
});

app.get("/register", (req,res)=>{
    res.render('register.ejs');
});

app.post("/login", (req,res)=>{
    const user = {username: req.body.username, password: req.body.password};
    req.login(user, (err)=>{
        if(err){
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/register", (req,res)=>{
    User.register({username: req.body.username}, req.body.password, (err, user)=>{
        if(err) { 
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/secrets");
            });
        }
    });
});

app.listen(3000, ()=> {console.log("server has begun running...")})