const URL = require('../models/urlModel');
const UAParser = require('ua-parser-js');



exports.getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;

  try {
  
    const url = await URL.findOne({ customAlias: alias });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    if (!url.analytics || url.analytics.length === 0) {
      return res.status(200).json({
        totalClicks: 0,
        uniqueClicks: 0,
        clicksByDate: {},
        osType: {},
        deviceType: [],
      });
    }

  
    const clicksByDate = {};
    const osType = {};
    const deviceStats = {};

    url.analytics.forEach((entry) => {
    
      const date = entry.timestamp.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;

     
      const parser = new UAParser(entry.userAgent);
      const os = parser.getOS().name || 'Unknown';
      const device = parser.getDevice().type || 'Desktop';

      osType[os] = (osType[os] || 0) + 1;

    
      if (!deviceStats[device]) {
        deviceStats[device] = {
          uniqueClicks: 0,
          uniqueUsers: new Set(),
        };
      }
      deviceStats[device].uniqueClicks++;
      deviceStats[device].uniqueUsers.add(entry.ip);
    });

    
    const deviceType = Object.keys(deviceStats).map((device) => ({
      device,
      uniqueClicks: deviceStats[device].uniqueClicks,
      uniqueUsers: deviceStats[device].uniqueUsers.size, // Count unique IPs
    }));

   
    res.json({
      totalClicks: url.analytics.length,
      uniqueClicks: new Set(url.analytics.map((a) => a.ip)).size,
      clicksByDate,
      osType,
      deviceType,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
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
    const deviceStats = {};

    urls.forEach((url) => {
      totalClicks += url.clicks;

      url.analytics.forEach((entry) => {
        uniqueUsers.add(entry.ip); 

        const date = new Date(entry.timestamp).toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        const parser = new UAParser(entry.userAgent);
        const device = parser.getDevice().type || 'Desktop'; 

        if (!deviceStats[device]) {
          deviceStats[device] = {
            uniqueClicks: 0,
            uniqueUsers: new Set(),
          };
        }
        deviceStats[device].uniqueClicks++;
        deviceStats[device].uniqueUsers.add(entry.ip);
      });
    });

   
    const deviceType = Object.keys(deviceStats).map((device) => ({
      device,
      uniqueClicks: deviceStats[device].uniqueClicks,
      uniqueUsers: deviceStats[device].uniqueUsers.size,
    }));

    const response = {
      totalClicks,
      uniqueClicks: uniqueUsers.size,
      clicksByDate,
      deviceType,
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
    const osType = {};
    const deviceStats = {};

    urls.forEach((url) => {
      totalClicks += url.clicks;

      url.analytics.forEach((entry) => {
        uniqueUsers.add(entry.ip);

        // Parse date for daily clicks aggregation
        const date = entry.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        // Parse user-agent details using UAParser
        const parser = new UAParser(entry.userAgent);
        const os = parser.getOS().name || 'Unknown';
        const device = parser.getDevice().type || 'Desktop';

        // Update OS type counts
        osType[os] = (osType[os] || 0) + 1;

        // Update device stats
        if (!deviceStats[device]) {
          deviceStats[device] = {
            uniqueClicks: 0,
            uniqueUsers: new Set(),
          };
        }
        deviceStats[device].uniqueClicks++;
        deviceStats[device].uniqueUsers.add(entry.ip);
      });
    });

    // Convert deviceStats into an array of objects
    const deviceType = Object.keys(deviceStats).map((device) => ({
      device,
      uniqueClicks: deviceStats[device].uniqueClicks,
      uniqueUsers: deviceStats[device].uniqueUsers.size, // Count unique IPs
    }));

    res.json({
      totalUrls: urls.length,
      totalClicks,
      uniqueClicks: uniqueUsers.size,
      clicksByDate,
      osType,
      deviceType,
    });
  } catch (error) {
    console.error('Error fetching overall analytics:', error);
    res.status(500).json({ message: 'Error fetching overall analytics', error });
  }
};

