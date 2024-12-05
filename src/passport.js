const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const https = require('https'); // Import https module
const User = require('./models/userModel');
require('dotenv').config();


const agent = new https.Agent({ rejectUnauthorized: false });


const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (token, tokenSecret, profile, done) => {
  
    try {
      const user = await User.findOne({ googleId: profile.id });

      if (user) {
        
        return done(null, user);
      }

      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      if (!email) {
        return done(new Error("No email found in Google profile"), null);
      }

      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: email,
      });

      
      return done(null, newUser);
    } catch (err) {
      console.error("Error in GoogleStrategy callback:", err);
      return done(err, null);
    }
  }
);


googleStrategy._oauth2.setAgent(agent);


passport.use(googleStrategy);


passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {

  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

