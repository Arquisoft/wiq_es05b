const request = require('supertest');
const bcrypt = require('bcrypt');
const express = require('express');
const routes = require('./usersRoutes');

const mockUserRepository = {
  getUser: jest.fn(),
  insertUser: jest.fn(),
  checkValidId: jest.fn(),
};


const app = express();
app.use(express.json());
app.set("i18next", require("i18next"))
routes(app, mockUserRepository);

describe('User Routes', () => {
  it('adds a new user with unique username', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);
    mockUserRepository.getUser.mockResolvedValue(null);
    mockUserRepository.insertUser.mockResolvedValue({ username: 'username', password: hashedPassword });

    const res = await request(app).post('/adduser').send({ username: 'username', password });
    expect(res.statusCode).toEqual(200);
  });

  it('fails to add a new user with existing username', async () => {
    mockUserRepository.getUser.mockResolvedValue({ username: 'username' });

    const res = await request(app).post('/adduser').send({ username: 'username', password: 'password' });
    expect(res.statusCode).toEqual(400);
  });

  it('fetches user by id', async () => {
    mockUserRepository.checkValidId.mockReturnValue(true);
    mockUserRepository.getUser.mockResolvedValue({ _id: 'userId', username: 'username' });

    const res = await request(app).get('/user/userId');
    expect(res.statusCode).toEqual(200);
  });

  it('returns error for invalid id format', async () => {
    mockUserRepository.checkValidId.mockReturnValue(false);

    const res = await request(app).get('/user/invalid');
    expect(res.statusCode).toEqual(400);
  });

  it('returns error for non-existent user', async () => {
    mockUserRepository.checkValidId.mockReturnValue(true);
    mockUserRepository.getUser.mockResolvedValue(null);

    const res = await request(app).get('/user/nonexistent');
    expect(res.statusCode).toEqual(404);
  });
});