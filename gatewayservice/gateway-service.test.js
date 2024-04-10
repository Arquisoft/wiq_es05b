const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');
const e = require('express');

afterAll(async () => {
    app.close();
});

jest.mock('axios');

/*User service tests*/

describe('[Gateway Service] - Auth', () => {

    // Login
    it('should repsond with 200 after a successful login', async () => {
        // Mock responses from external service
        axios.post.mockImplementation((url, data) => {
            return Promise.resolve({ data: { token: 'mockedToken', username: "testuser", userId: "1234" } });
        });

        const response = await request(app)
            .post('/login')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token", 'mockedToken');
        expect(response.body).toHaveProperty("username", 'testuser');
        expect(response.body).toHaveProperty("userId", '1234');
    });

    it('should repsond with 500 after a invalid login', async () => {
        // Mock responses from external service
        axios.post.mockImplementation((url, data) => {
            return Promise.reject({ error: "Invalid credentials" });
        });

        const response = await request(app)
            .post('/login')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(response.statusCode).toBe(500);
    });

    //Token validation
    it('should respond with 200 after a successful token validation', async () => {

        // Mock responses from external service
        axios.get.mockImplementation((url, data) => {
            return Promise.resolve({ data: { valid: true } });
        });

        const response = await request(app).get('/validate/faketoken');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("valid", true);
    });

    it('should respond with 500 due to an invalid token validation', async () => {
        // Mock responses from external service with a rejected value containing specific values
        const errorResponse = { valid:false };
        axios.get.mockImplementation((url, data) => {
            return Promise.reject(errorResponse);
        });

        const response = await request(app).get('/validate/faketoken');
        console.log(response)

        // Assertions
        expect(response.statusCode).toBe(500);
    });


});