const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.googleSignIn = (req, res) => {

  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res
  );


};


exports.googleSignInCallback = (req, res) => {

  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      console.error("Error during authentication:", err);
    }
    if (!user) {
      console.error("User authentication failed");
      return res.status(400).json({ message: 'Authentication failed' });
    }



    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    console.log("Login Success!!")
    return res.json({ token });
  })(req, res);
};
