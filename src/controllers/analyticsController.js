const URL = require('../models/urlModel');

exports.getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;
  

  try {
    const url = await URL.findOne({ customAlias: alias });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const clicksByDate = url.analytics.reduce((acc, entry) => {
      const date = entry.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const osType = {};
    const deviceType = {};

    url.analytics.forEach((entry) => {
      
      const os = 'Unknown'; // Replace with parsed OS
      const device = 'Unknown'; // Replace with parsed device type

      osType[os] = (osType[os] || 0) + 1;
      deviceType[device] = (deviceType[device] || 0) + 1;
    });

    res.json({
      totalClicks: url.clicks,
      uniqueClicks: new Set(url.analytics.map((a) => a.ip)).size,
      clicksByDate,
      osType,
      deviceType,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error });
  }
};

exports.getTopicAnalytics = async (req, res) => {
  const { topic } = req.params;

  try {
   
    const urls = await URL.find({ topic });

    if (!urls || urls.length === 0) {
      return res.status(404).json({ message: 'No URLs found for this topic' });
    }

   
    let totalClicks = 0;
    const uniqueUsers = new Set();
    const clicksByDate = {};

   
    urls.forEach((url) => {
      totalClicks += url.clicks;

      url.analytics.forEach((entry) => {
        uniqueUsers.add(entry.ip); // Collect unique IPs

        
        const date = new Date(entry.timestamp).toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      });
    });

   
    const response = {
      totalClicks,
      uniqueClicks: uniqueUsers.size,
      clicksByDate,
      urls: urls.map((url) => ({
        shortUrl: url.shortUrl,
        longUrl: url.longUrl,
        totalClicks: url.clicks,
        uniqueClicks: new Set(url.analytics.map((a) => a.ip)).size,
      })),
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching topic analytics:', error.message);
    return res.status(500).json({ message: 'Error fetching topic analytics', error });
  }
};


exports.getOverallAnalytics = async (req, res) => {
  try {
    const urls = await URL.find();

    let totalClicks = 0;
    let uniqueUsers = new Set();
    const clicksByDate = {};

    urls.forEach((url) => {
      totalClicks += url.clicks;

      url.analytics.forEach((entry) => {
        uniqueUsers.add(entry.ip);

        const date = entry.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      });
    });

    res.json({
      totalUrls: urls.length,
      totalClicks,
      uniqueClicks: uniqueUsers.size,
      clicksByDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overall analytics', error });
  }
};
