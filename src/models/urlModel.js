const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  customAlias: { type: String, unique: true },
  topic: { type: String },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  analytics: [
    {
      timestamp: { type: Date, default: Date.now },
      userAgent: String,
      ip: String,
      location: String,
      deviceId: String,
    },
  ],
});

module.exports = mongoose.model('URL', urlSchema);
