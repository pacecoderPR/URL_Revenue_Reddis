const express = require('express');
const router = express.Router();
const { googleSignIn, googleSignInCallback } = require('../controllers/authController');


router.get('/auth/google', googleSignIn);


router.get('/auth/google/callback', googleSignInCallback);

module.exports = router;
