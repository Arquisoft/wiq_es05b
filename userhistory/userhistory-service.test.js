const request = require('supertest');
const {MongoMemoryServer} = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Save = require('./history-model');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

let mongoServer;
let app;
let saveId;

let save = {
    userId: '123456789012345678901234',
    category: 'Capitals',
    questions: []
};

let question = {
    userId: '123456789012345678901234',
    category: 'Capitals',
    last: false,
    statement: "Question 1",
    options: [
        "Category 1"
    ],
    answer: 1,
    correct: 0,
    time: 10,
    points: 10
};

async function addSave(save) {
    await mongoose.connect(process.env.MONGODB_URI);
    const newSave = new Save(save);
    const s = await newSave.save();
    await mongoose.connection.close()
    return s._id
}

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    app = require('./history-service');
    //Load database with initial conditions
    saveId = await addSave(save);

});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('[History Service] - /create', () => {

    beforeEach(async () => {
        save = {
            userId: '123456789012345678901234',
            category: 'Capitals',
            questions: []
        };
    });

    it('Should return 201 when created', async () => {
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('Should return 400 when missing userId', async () => {
        delete save.userId
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing userId")
    });

    it('Should return 400 when missing category', async () => {
        delete save.category
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing category")
    });

    it('Should return 400 when category is empty', async () => {
        save.category = " "
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Category cannot be empty")
    });

    it('Should return 400 when userId is invalid', async () => {
        save.userId = '1234'
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid userId format")
    });

});

describe('[History Service] - /add/:id', () => {

    beforeEach(async () => {
        question = {
            userId: '123456789012345678901234',
            category: 'Capitals',
            last: false,
            statement: "Question 1",
            options: [
                "Category 1"
            ],
            answer: 1,
            correct: 0,
            time: 10,
            points: 10
        }
    });

    it('Should return 200 when added', async () => {
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Question added successfully");
    });


    it('Should return 400 when missing last', async () => {
        delete question.last
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing last");
    });

    it('Should return 400 when missing statement', async () => {
        delete question.statement
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing statement");
    });

    it('Should return 400 when missing options', async () => {
        delete question.options
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing options");
    });

    it('Should return 400 when missing answer', async () => {
        delete question.answer
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing answer");
    });

    it('Should return 400 when missing correct', async () => {
        delete question.correct
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing correct");
    });

    it('Should return 400 when missing time', async () => {
        delete question.time
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing time");
    });

    it('Should return 400 when missing points', async () => {
        delete question.points
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Missing points");
    });

    it('Should return 400 when id is invalid', async () => {
        const response = await request(app).post(`/add/1234`).send(question);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid id format");
    });

});

describe('[History Service] - /get/:userId/', () => {

    beforeEach(async () => {
        save = {
            userId: '123456789012345678901234',
            category: 'Capitals',
            questions: []
        };
    });

    it('Should return 200 when obtained', async () => {
        const response = await request(app).get(`/get/${save.userId}`);

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('saves');
    });

    it('Should return 400 when invalid userId', async () => {
        save.userId = '1234'
        const response = await request(app).get(`/get/${save.userId}`);

        console.log(response.body.error);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid userId format");
    });

});

describe('[History Service] - /get/:userId/:id', () => {

    beforeEach(async () => {
        save = {
            userId: '123456789012345678901234',
            category: 'Capitals',
            questions: []
        };
    });

    it('Should return 200 when obtained', async () => {
        const response = await request(app).get(`/get/${save.userId}/${saveId}`);

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('userId', '123456789012345678901234');
        expect(response.body).toHaveProperty('category', 'Capitals');
    });


    it('Should return 400 when invalid id', async () => {
        const response = await request(app).get(`/get/${save.userId}/1234`);

        console.log(response.body.error);

        expect(response.status).toBe(400);
        expect(response.body).toBe("error", "Invalid id format");
    });

    it('Should return 404 when save not found', async () => {
        save.userId = '234567890123456789012345'
        const response = await request(app).get(`/get/${save.userId}/${saveId}`);

        console.log(response.body.error);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Save not found");
    });

    it('Should return 400 when invalid userId', async () => {
        save.userId = '1234'
        const response = await request(app).get(`/get/${save.userId}/${saveId}`);

        console.log(response.body.error);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid userId format");
    });

});

/**
describe('[History Service] - /ranking/:n', () => {

    it('Should return 200 when obtained', async () => {
        const response = await request(app).get(`/ranking/2`);

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('totalPoints');
        expect(response.body).toHaveProperty('totalTime');
    });

    it('Should return 400 when invalid value for n', async () => {
        const response = await request(app).get(`/ranking/a`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", 'Invalid value for n');
    });
});
*/

