const request = require('supertest');
const axios = require('axios');
const app = require('../gateway-service');

afterAll(async () => {
    app.close();
  });

jest.mock('axios');