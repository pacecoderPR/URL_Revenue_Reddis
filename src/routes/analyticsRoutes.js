const express = require('express');
const router = express.Router();
const {
  getUrlAnalytics,
  getOverallAnalytics,
  getTopicAnalytics,
} = require('../controllers/analyticsController');

// Routes
router.get('/overall', getOverallAnalytics); // Specific route for overall analytics
router.get('/:alias', getUrlAnalytics); // Alias analytics (renamed to avoid conflicts)
router.get('/topic/:topic', getTopicAnalytics); // Topic analytics (renamed to avoid conflicts)

module.exports = router;
