let nanoid;

(async () => {
  const { nanoid: generatedNanoid } = await import('nanoid');
  nanoid = generatedNanoid;

  const shortUrl = nanoid();
})();
const redisClient = require('../utils/redisClient');
const URL = require('../models/urlModel');

exports.createShortUrl = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: 'Long URL is required' });
  }

  try {
    const alias = customAlias || nanoid();
    const shortUrl = `${process.env.BASE_URL}/api/${alias}`;

    const newUrl = await URL.create({
      longUrl,
      shortUrl,
      customAlias: alias,
      topic,
    });

    redisClient.set(alias, longUrl, 'EX', 60 * 60 * 24);

    res.status(201).json({
      shortUrl: newUrl.shortUrl,
      createdAt: newUrl.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating short URL', error });
  }
};

exports.redirectToOriginalUrl = async (req, res) => {
  const { alias } = req.params;
  try {
    const cachedUrl = await redisClient.get(alias);
    console.log("cachedurl", cachedUrl)
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    const url = await URL.findOne({ customAlias: alias });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }


    url.clicks++;
    url.analytics.push({
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    await url.save();

    redisClient.set(alias, url.longUrl, 'EX', 60 * 60 * 24); // Cache the URL for 24 hours

    res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error redirecting to URL', error });
  }
};
