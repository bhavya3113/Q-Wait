const express = require("express");
const mongoose = require("mongoose"); 
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const passport = require("passport");
const cookieSession = require('cookie-session');
require('./passport-setup');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieSession({
  name:'tuto-session',
  keys:['key1','key2']
}))
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use('/auth',authRoutes);
app.get("/failed",(req,res)=>res.json("failed to login"));
app.get('/google',passport.authenticate('google',{scope:['profile','email']}));
app.get('/auth/google/callback',passport.authenticate("google",{failureRedirect:'/failed'}),
  function(req,res){
    res.json("welcome"); 
  }
);

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


mongoose
  .connect(
    process.env.CONNECT_TO_DB
  )
  .then(result => {
    app.listen(process.env.PORT);
    console.log("connected");
  })
  .catch(err => console.log("error",err));
  