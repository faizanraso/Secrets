require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express()
app.use(express.static('public'));
app.set('veiwengine', ejs);
app.use(bodyParser.urlencoded({extended:true}));

//mongoose
mongoose.connect('mongodb://localhost:27017/userDB')
const userSchema = new mongoose.Schema({email: String, password: String});
const key = process.env.ENCRYPTION_KEY
userSchema.plugin(encrypt, {secret: key, encrptedFields: 'password'});
const User = new mongoose.model("User", userSchema);


app.get("/", (req,res)=>{
    res.render('home.ejs');
});

app.get("/login", (req,res)=>{
    res.render('login.ejs');
});

app.get("/register", (req,res)=>{
    res.render('register.ejs');
});

app.post("/login", (req,res)=>{
    User.find({email: req.body.username, password: req.body.password}, (err)=>{
        if(err){
            console.log(err);
        } else {
            res.render("secrets.ejs");
        }
    });
});

app.post("/register", (req,res)=>{
    User.create({email: req.body.username, password: req.body.password}, (err)=>{
        if(err) {
            console.log(err);
        } else {
            res.render("secrets.ejs")
        }
    });
});


app.listen(3000, ()=> {console.log("server has begun running...")})