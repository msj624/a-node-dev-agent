const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
  describe('Health endpoint', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
    });

    it('should return JSON response', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Non-existent endpoint', () => {
    it('should handle non-existent routes gracefully', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.statusCode).toBe(404);
    });
  });
});
