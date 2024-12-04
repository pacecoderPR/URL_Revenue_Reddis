const express = require('express');
const { rateLimiterMiddleware } = require('../middlewares/rateLimiter');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createShortUrl,
  redirectToOriginalUrl,
} = require('../controllers/urlController');

const router = express.Router();

router.post('/shorten', authMiddleware, rateLimiterMiddleware, createShortUrl);
router.get('/:alias', redirectToOriginalUrl);

module.exports = router;
