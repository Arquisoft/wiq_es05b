const request = require('supertest');
const {MongoMemoryServer} = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Save = require('./history-model');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

let mongoServer;
let app;

let save = {
    userId: '123456789012345678901234',
    category: 'Capitals',
};

let save2 = {
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
    await addSave(save);

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
        expect(response.body.error).toBe("Missing userId")
    });

    it('Should return 400 when missing category', async () => {
        delete save.category
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing category")
    });

    it('Should return 400 when category is empty', async () => {
        save.category = " "
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Category cannot be empty")
    });

    it('Should return 400 when userId is invalid', async () => {
        save.userId = '1234'
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid userId format")
    });

});

describe('[History Service] - /add/:id', () => {
    let saveId
    beforeEach(async () => {
        saveId = await addSave(save2);
        save2 = {
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
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Question added successfully");
    });


    it('Should return 400 when missing last', async () => {
        delete save2.last
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing last");
    });

    it('Should return 400 when missing statement', async () => {
        delete save2.statement
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing statement");
    });

    it('Should return 400 when missing options', async () => {
        delete save2.options
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing options");
    });

    it('Should return 400 when missing answer', async () => {
        delete save2.answer
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing answer");
    });

    it('Should return 400 when missing correct', async () => {
        delete save2.correct
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing correct");
    });

    it('Should return 400 when missing time', async () => {
        delete save2.time
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing time");
    });

    it('Should return 400 when missing points', async () => {
        delete save2.points
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing points");
    });

    it('Should return 400 when id is invalid', async () => {
        saveId = '1234'
        const response = await request(app).post(`/add/${saveId}`).send(save2);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid id format");
    });

});

describe('[History Service] - /get/:userId/', () => {

    beforeEach(async () => {
        save = {
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
    });

    it('Should return 200 when obtained', async () => {
        const response = await request(app).get(`/get/${save.userId}`);

        console.log(response.body.error);

        expect(response.status).toBe(200);
    });

});

