const passport = require('passport');
const jwt = require('jsonwebtoken');

// Controller to handle Google Sign-In authentication and token generation
exports.googleSignIn = (req, res) => {
  console.log("Google Sign-In request URL:", req.originalUrl);
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res
  );
  // console.log("google req",req);
  // console.log("goole res",res);
  console.log("is sigin working")
};

// Callback route for Google Sign-In
exports.googleSignInCallback = (req, res) => {
  console.log("Google Sign-In callback triggered");
  console.log("Google Sign-callback request URL:", req.originalUrl);
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      console.error("Error during authentication:", err);
    }
    if (!user) {
      console.error("User authentication failed");
      return res.status(400).json({ message: 'Authentication failed' });
    }

    console.log("Authenticated user:", user);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    console.log("Login Success!!!!!!")
    return res.json({ token });
  })(req, res);
};
