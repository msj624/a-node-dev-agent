const request = require('supertest');
const express = require('express');
const healthRouter = require('../../src/routes/health');

describe('Health Route', () => {
  let app;

  // Setup a test app for isolated testing of the health route
  beforeEach(() => {
    app = express();
    app.use('/health', healthRouter);
  });

  describe('GET /health', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
    });

    it('should return JSON with status, timestamp, and uptime', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should return status as "ok"', async () => {
      const response = await request(app).get('/health');
      expect(response.body.status).toBe('ok');
    });

    it('should return timestamp in ISO format', async () => {
      const response = await request(app).get('/health');
      expect(Date.parse(response.body.timestamp)).not.toBeNaN();
      expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return uptime as a number', async () => {
      const response = await request(app).get('/health');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThan(0);
    });
  });

  describe('Mocked tests', () => {
    let originalUptime;
    let originalDateToISOString;
    
    beforeEach(() => {
      // Save original functions
      originalUptime = process.uptime;
      originalDateToISOString = Date.prototype.toISOString;
      
      // Mock process.uptime
      process.uptime = jest.fn().mockReturnValue(123.456);
      
      // Mock Date.toISOString
      const mockDate = new Date(2025, 9, 7, 12, 0, 0);
      global.Date = jest.fn(() => mockDate);
      Date.prototype.toISOString = jest.fn(() => '2025-10-07T12:00:00.000Z');
    });
    
    afterEach(() => {
      // Restore original functions
      process.uptime = originalUptime;
      Date.prototype.toISOString = originalDateToISOString;
      global.Date = Date;
    });
    
    it('should return mocked values', async () => {
      const response = await request(app).get('/health');
      
      expect(response.body).toEqual({
        status: 'ok',
        timestamp: '2025-10-07T12:00:00.000Z',
        uptime: 123.456
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle HEAD requests', async () => {
      const response = await request(app).head('/health');
      expect(response.statusCode).toBe(200);
    });
    
    it('should reject POST requests', async () => {
      const response = await request(app).post('/health');
      expect(response.statusCode).toBe(404);
    });
  });
});
