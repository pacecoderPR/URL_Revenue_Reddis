const request = require('supertest');
const app = require('../src/app'); // Path to your app.js

describe('URL Shortening API', () => {
  it('should return a shortened URL for a valid original URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('shortUrl');
  });

  it('should return 400 for an invalid original URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'invalid-url' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid URL provided.');
  });
});
