const request = require('supertest');
const axios = require('axios');
const app = require('../gateway-service');

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

// TODO - Test failure cases

describe('[Gateway Service] - /login', () => {
  beforeEach(() => {
    // Mock responses from external services
    axios.post.mockImplementation((url, data) => {
        return Promise.resolve({ data: { token: 'mockedToken', username: "testuser", userId: "1234" } });
    });
  })

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token", 'mockedToken');
    expect(response.body).toHaveProperty("username", 'testuser');
    expect(response.body).toHaveProperty("userId", '1234');
  });
});