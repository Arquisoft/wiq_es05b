const request = require('supertest');
const express = require('express');
const axios = require('axios');
const authRoutes = require('./authRoutes');

jest.mock('axios');

const app = express();
app.use(express.json());
authRoutes(app, axios);

describe('Auth Routes', () => {
    it('logs in with valid credentials', async () => {
        axios.post.mockResolvedValue({ data: { token: 'token', username: 'username', userId: 'userId' } });

        const res = await request(app).post('/login').send({ username: 'username', password: 'password' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('userId');
    });

    it('fails to log in with invalid credentials', async () => {
        axios.post.mockRejectedValue({ response: { status: 401, data: 'Unauthorized' } });

        const res = await request(app).post('/login').send({ username: 'username', password: 'password' });
        expect(res.statusCode).toEqual(401);
    });

    it('validates a valid token', async () => {
        axios.get.mockResolvedValue({ data: { valid: true } });

        const res = await request(app).get('/validate/token');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ valid: true });
    });

    it('fails to validate an invalid token', async () => {
        axios.get.mockRejectedValue({ response: { status: 401, data: 'Unauthorized' } });

        const res = await request(app).get('/validate/invalid');
        expect(res.statusCode).toEqual(401);
    });
});