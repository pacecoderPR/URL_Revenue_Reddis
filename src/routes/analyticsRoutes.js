const express = require('express');
const router = express.Router();
const {
  getUrlAnalytics,
  getOverallAnalytics,
  getTopicAnalytics,
} = require('../controllers/analyticsController');

// Routes
router.get('/overall', getOverallAnalytics); // Specific route for overall analytics
router.get('/:alias', getUrlAnalytics); 
router.get('/topic/:topic', getTopicAnalytics); 

module.exports = router;
