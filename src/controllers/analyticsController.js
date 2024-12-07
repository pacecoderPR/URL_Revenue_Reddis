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
        deviceId: req.deviceId,
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
      deviceStats[device].uniqueUsers.add(entry.ip||entry.deviceId);
    });

    
    const deviceType = Object.keys(deviceStats).map((device) => ({
      device,
      uniqueClicks: deviceStats[device].uniqueClicks,
      uniqueUsers: deviceStats[device].uniqueUsers.size, // Count unique IPs
    }));

   
    res.json({
      totalClicks: url.analytics.length,
      uniqueClicks: new Set(url.analytics.map((a) => a.ip||a.deviceId)).size,
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

    urls.forEach((url) => {
      totalClicks += url.analytics.length;

      url.analytics.forEach((entry) => {
        uniqueUsers.add(entry.ip || entry.deviceId);

        const date = entry.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      });
    });

    const response = {
      totalClicks,
      uniqueClicks: uniqueUsers.size,
      clicksByDate: Object.keys(clicksByDate).map((date) => ({
        date,
        clickCount: clicksByDate[date],
      })),
      urls: urls.map((url) => ({
        shortUrl: url.shortUrl,
        totalClicks: url.analytics.length,
        uniqueClicks: new Set(url.analytics.map((entry) => entry.ip || entry.deviceId)).size,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching topic analytics:', error);
    res.status(500).json({ message: 'Error fetching topic analytics', error });
  }
};

exports.getOverallAnalytics = async (req, res) => {
  try {
    const urls = await URL.find();

    if (!urls || urls.length === 0) {
      return res.status(404).json({ message: 'No URLs found' });
    }

    let totalClicks = 0;
    const uniqueUsers = new Set();
    const clicksByDate = {};
    const osType = {};
    const deviceStats = {};

    urls.forEach((url) => {
      totalClicks += url.analytics.length;

      url.analytics.forEach((entry) => {
        uniqueUsers.add(entry.ip || entry.deviceId);

        const date = entry.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        const parser = new UAParser(entry.userAgent);
        const os = parser.getOS().name || 'Unknown';
        const device = parser.getDevice().type || 'Desktop';

        osType[os] = osType[os] || { uniqueClicks: 0, uniqueUsers: new Set() };
        osType[os].uniqueClicks++;
        osType[os].uniqueUsers.add(entry.ip || entry.deviceId);

        deviceStats[device] = deviceStats[device] || { uniqueClicks: 0, uniqueUsers: new Set() };
        deviceStats[device].uniqueClicks++;
        deviceStats[device].uniqueUsers.add(entry.ip || entry.deviceId);
      });
    });

    const osTypeArray = Object.keys(osType).map((os) => ({
      osName: os,
      uniqueClicks: osType[os].uniqueClicks,
      uniqueUsers: osType[os].uniqueUsers.size,
    }));

    const deviceTypeArray = Object.keys(deviceStats).map((device) => ({
      deviceName: device,
      uniqueClicks: deviceStats[device].uniqueClicks,
      uniqueUsers: deviceStats[device].uniqueUsers.size,
    }));

    res.json({
      totalUrls: urls.length,
      totalClicks,
      uniqueClicks: uniqueUsers.size,
      clicksByDate: Object.keys(clicksByDate).map((date) => ({
        date,
        clickCount: clicksByDate[date],
      })),
      osType: osTypeArray,
      deviceType: deviceTypeArray,
    });
  } catch (error) {
    console.error('Error fetching overall analytics:', error);
    res.status(500).json({ message: 'Error fetching overall analytics', error });
  }
};


