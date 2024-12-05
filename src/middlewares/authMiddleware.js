const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    next();
  } catch (err) {
    console.error('Token Verification Error:', err.message); 
    res.status(401).json({ message: 'Invalid token' });
  }
};
