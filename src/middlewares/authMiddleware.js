const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Handle 'Bearer' prefix
  console.log('Received Token:', token);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // const decoded = jwt.verify(token, "testing");
    // console.log('Decoded Token:', decoded); // Log decoded token for debugging
    // req.user = decoded;
    next();
  } catch (err) {
    console.error('Token Verification Error:', err.message); // Log error details
    res.status(401).json({ message: 'Invalid token' });
  }
};
