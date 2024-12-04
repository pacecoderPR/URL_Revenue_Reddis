const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const https = require('https'); // Import https module
const User = require('./models/userModel');
require('dotenv').config();

console.log("Initializing Passport...");

// Log environment variables for debugging
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not Set');
console.log("Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);

// Create an HTTPS agent to bypass certificate issues (if using self-signed certificates)
const agent = new https.Agent({ rejectUnauthorized: false });

// Configure Google Strategy
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (token, tokenSecret, profile, done) => {
    console.log("Inside GoogleStrategy callback");
    try {
      // Find or create user logic
      const user = await User.findOne({ googleId: profile.id });

      if (user) {
        console.log("User found:", user);
        return done(null, user);
      }

      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      if (!email) {
        console.error("No email found in Google profile!");
        return done(new Error("No email found in Google profile"), null);
      }

      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: email,
      });

      console.log("New user created:", newUser);
      return done(null, newUser);
    } catch (err) {
      console.error("Error in GoogleStrategy callback:", err);
      return done(err, null);
    }
  }
);

// Attach the HTTPS agent to the Google Strategy's internal OAuth2 instance
googleStrategy._oauth2.setAgent(agent);

// Use the configured Google Strategy in Passport
passport.use(googleStrategy);

// Serialize user info into the session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user by ID:", id);

  try {
    const user = await User.findById(id);
    console.log("User deserialized:", user);
    done(null, user);
  } catch (err) {
    console.error("Error during deserialization:", err);
    done(err, null);
  }
});

console.log("Passport setup complete.");
