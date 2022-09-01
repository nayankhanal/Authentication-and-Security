//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// const secret = "ThisIsOurSecret.";
//----------------------------Already in .env file.------------------------------------//

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedField: ["password"]});
//---------------------------SO, process.env.SECRET----------------------------------------//

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  User.findOne({username: req.body.username},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(!found){
        const newUser = new User({
          username: req.body.username,
          password: req.body.password
        });
        newUser.save();
        res.render("secrets");
      }else{
        res.redirect("/register");
        alert("This username is already in use, please try again with another one");
      }
    }
  })
});

app.post("/login",function(req,res){
  User.findOne({username: req.body.username},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(found){
        if(found.password === req.body.password){
          res.render("secrets");
        }else{
          res.redirect("/login");
          alert("Please enter correct data.");
        }
      }else{
        res.redirect("/login");
        alert("Please enter correct data.");
      }
    }
  });
});


app.listen(3000,function(){
  console.log("server started successfully.");
});
