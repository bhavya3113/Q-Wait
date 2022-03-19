const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy


passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });   

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:8080/auth/google/callback"
    },
    function(accessToken , refreshToken , profile , done){
        console.log(accessToken);
        console.log(profile);
        return done(null,profile);
    }
)); 