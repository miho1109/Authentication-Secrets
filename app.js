//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});

usersSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", usersSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.route("/register")
  .get(function(req, res){
    res.render("register");
  })
  .post(function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save(function(err){
      if(!err){
          res.render("secrets");
      }else{
        console.log(err);
      }
    });
  });

app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }
        }else{
          console.log("User not found!");
        }
      }
    });
  });






app.listen(3000, function() {
  console.log("Server is started at port 3000");
});
