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
    const shortUrl = `${process.env.GLOBAL_URL}/api/${alias}`;

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

    const url = await URL.findOneAndUpdate(
      { customAlias: alias },
      {
        $inc: { clicks: 1 },
        $push: {
          analytics: {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
          },
        },
      },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    res.redirect(url.longUrl);
  } catch (error) {
    console.error('Error redirecting to URL:', error);
    res.status(500).json({ message: 'Error redirecting to URL', error });
  }
};