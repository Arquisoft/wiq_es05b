const request = require('supertest');
const axios = require('axios');
let app = require('./gateway-service');

afterAll(async () => {
    app.close();
});

jest.mock('axios');

/*Auth service tests*/

describe('[Gateway Service] - /login', () => {

    it('should repsond with 200 after a successful login', async () => {
        // Mock responses from external service
        // mockAxios.onPost("/login").reply(200, {token: 'mockedToken', username: "testuser", userId: "1234"})
        axios.post.mockImplementation((url, data) => {
            return Promise.resolve({data: {token: 'mockedToken', username: "testuser", userId: "1234"}});
        });

        const response = await request(app)
            .post('/login')
            .send({username: 'testuser', password: 'testpassword'});

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token", 'mockedToken');
        expect(response.body).toHaveProperty("username", 'testuser');
        expect(response.body).toHaveProperty("userId", '1234');
    });

    it('should repsond with 500 after a invalid login', async () => {
        // Mock responses from external service
        axios.post.mockImplementation((url, data) => {
            return Promise.reject({error: "Invalid credentials"});
        });

        const response = await request(app)
            .post('/login')
            .send({username: 'testuser', password: 'testpassword'});

        expect(response.statusCode).toBe(500);
    });

});
describe('[Gateway Service] - /validate', () => {

    it('should respond with 200 after a successful token validation', async () => {

        // Mock responses from external service
        axios.get.mockImplementation((url, data) => {
            return Promise.resolve({data: {valid: true}});
        });

        const response = await request(app).get('/validate/faketoken');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("valid", true);
    });

    it('should respond with 500 due to an invalid token validation', async () => {
        // Mock responses from external service with a rejected value containing specific values
        const errorResponse = {valid: false};
        axios.get.mockImplementation((url, data) => {
            return Promise.reject(errorResponse);
        });

        const response = await request(app).get('/validate/faketoken');

        // Assertions
        expect(response.statusCode).toBe(500);
    });

});

/* Jordi service tests */

describe('[Gateway Service] - /game/categories', () => {
    it('should return categories with valid token', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        axios.get.mockResolvedValueOnce({status: 200, data: {categories: ['category1', 'category2']}});

        const res = await request(app)
            .get('/game/categories')
            .send({token: 'validToken'});

        expect(res.status).toBe(200);
        expect(res.body).toEqual({categories: ['category1', 'category2']});
    });
});

describe('[Gateway Service] - /game/questions/:category/:n', () => {
    it('should return questions from jordi service', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: [{question: 'question1', answer: 'a'}, {question: 'question2', answer: 'b'}]
        });

        const res = await request(app)
            .get('/game/questions/categoryMock/2')
            .send({token: 'validToken'});

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{"question": "question1"}, {"question": "question2"}]);
    });
});

describe('[Gateway Service] - /game/answer', () => {
    it('should return 200 status with 100 points for a correct answer', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get question request
        axios.get.mockResolvedValueOnce({data: {answer: 'a'}});
        // Save question in historic
        axios.post.mockResolvedValueOnce({answer: 'a', points: '100'});

        const reqBody = {
            questionId: 'questionId',
            last: 'last',
            answer: 'a',
            time: 'time',
            saveId: 'saveId',
            statement: 'statement',
            options: ['a', 'b']
        }

        const res = await request(app)
            .post('/game/answer')
            .send(reqBody);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("answer", 'a');
        expect(res.body).toHaveProperty("points", 100);

    });

    it('should return 200 status with -100 points for a wrong answer', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get question request
        axios.get.mockResolvedValueOnce({data: {answer: 'a'}});
        // Save question in historic
        axios.post.mockResolvedValueOnce({answer: 'a', points: '100'});

        const reqBody = {
            questionId: 'questionId',
            last: 'last',
            answer: 'b',
            time: 'time',
            saveId: 'saveId',
            statement: 'statement',
            options: ['a', 'b']
        }

        const res = await request(app)
            .post('/game/answer')
            .send(reqBody);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("answer", 'a');
        expect(res.body).toHaveProperty("points", -10);

    });

    it('should return 400 status since there are missing fields', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get question request
        axios.get.mockResolvedValueOnce({data: {answer: 'a'}});
        // Save question in historic
        axios.post.mockResolvedValueOnce({answer: 'a', points: '100'});

        const reqBody = {
            questionId: 'questionId',
            last: 'last',
            answer: 'b',
            time: 'time'
        }

        const res = await request(app)
            .post('/game/answer')
            .send(reqBody);

        expect(res.status).toBe(400);
    });
});

/* User service tests */
// FIXME
/*
describe('[Gateway Service] - /user/:userId', () => {

    it('should return 200 status and the user', async () => {

        //Auth middleware request
        // mockAxios.onPost()
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get user from users service
        axios.get.mockResolvedValueOnce({data: {username: "Berengario"}});

        const res = await request(app).get('/user/mockedUserId');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", 'Berengario');
    });
})
*/

/* History service tests */
// FIXME
/*describe('[Gateway Service] - /history/get/:userId', () => {
    it('should return 200 and the history for the user', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get user from users service
        // mockAxios.onGet(`/validate`).reply(200, {valid: true, data: {userId: "mockedUserId"}});
        // mockAxios.onGet(`/history/get`).reply(200, {history: 'mockHistory'});
        axios.get.mockResolvedValueOnce({status: 200, data: {history: 'mockHistory'}});

        const res = await request(app).get('/history/get/mockedUserId');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("history", 'mockHistory');
    });
})*/

const express = require('express');
const routes = require('../gatewayservice/routes/routes');

app = express();
app.use(express.json());
routes(app);

describe('Routes', () => {
    it('returns OK status for health check', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ status: "OK" });
    });

    it('returns teapot status for root path', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(418);
        expect(res.body).toEqual({ message: "¯\_(ツ)_/¯" });
    });
});