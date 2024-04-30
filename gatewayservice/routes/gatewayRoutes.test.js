const request = require('supertest');
const express = require('express');
const gatewayRoutes = require('./gatewayRoutes');

const app = express();
app.use(express.json());
gatewayRoutes(app);

describe('Gateway Routes', () => {
  it('returns health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: "OK" });
  });

  it('returns a teapot status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(418);
    expect(res.body).toEqual({ message: "¯\_(ツ)_/¯" });
  });
});
