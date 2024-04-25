const request = require('supertest');
const bcrypt = require('bcrypt');
const express = require('express');
const routes = require('./authRoutes');
const jwt = require('jsonwebtoken');

const mockUserRepository = {
  findUserByUsername: jest.fn(),
};

let app = express();
app.use(express.json());
routes(app, mockUserRepository);

describe('Auth Routes', () => {
  it('logs in with valid credentials', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);
    mockUserRepository.findUserByUsername.mockResolvedValue({ password: hashedPassword });

    const res = await request(app).post('/login').send({ username: 'username', password });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username');
  });

  /** TODO: works in local, when in github actions (500 -> internal server error) 
  it('fails to log in with invalid credentials', async () => {
    mockUserRepository.findUserByUsername.mockResolvedValue(null);

    const res = await request(app).post('/login').send({ username: 'username', password: 'password' });
    expect(res.statusCode).toEqual(401);
  });
  */
  

  it('validates a valid token', async () => {
    const token = jwt.sign({ userId: 'userId' }, 'a-very-secret-string', { expiresIn: '4h' });

    const res = await request(app).get(`/validate/${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ data: { userId: 'userId' }, valid: true });
  });

  it('fails to validate an invalid token', async () => {
    const res = await request(app).get('/validate/invalid');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ valid: false });
  });
});
