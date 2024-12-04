const express = require('express');
const router = express.Router();
const { googleSignIn, googleSignInCallback } = require('../controllers/authController');
console.log("authroutes");
// Route for Google Sign-In
router.get('/auth/google', googleSignIn);

// Callback route after Google Sign-In
router.get('/auth/google/callback', googleSignInCallback);

module.exports = router;
