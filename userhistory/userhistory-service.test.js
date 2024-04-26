const request = require('supertest');
const {MongoMemoryServer} = require('mongodb-memory-server');
const Save = require('./history-model');
const mongoose = require('mongoose');

let mongoServer;
let app;
let saveId;

const baseSave = {
    userId: '123456789012345678901234',
    category: 'Capitals',
    questions: [],
    finished: false
};

const baseQuestion = {
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
    points: 10,
    isHot:false
};

const baseReq = {
    userId: '123456789012345678901234',
    category: 'Capitals'
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
});

afterEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await Save.deleteMany({})
    await mongoose.connection.close()
})

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('[History Service] - /create', () => {
    let req

    beforeEach(async () => {
        req = {...baseReq}

        const save = JSON.parse(JSON.stringify(baseSave));
        save.questions.push(baseQuestion);
        saveId = await addSave(save);
    })

    it('Should return 201 when created', async () => {
        const response = await request(app).post('/create').send(req);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('Should return 400 when missing userId', async () => {
        delete req.userId
        const response = await request(app).post('/create').send(req);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field userId")
    });

    it('Should return 400 when missing category', async () => {
        delete req.category
        const response = await request(app).post('/create').send(req);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field category")
    });

    it('Should return 400 when category is empty', async () => {
        req.category = " "
        const response = await request(app).post('/create').send(req);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Category cannot be empty")
    });

    it('Should return 400 when userId is invalid', async () => {
        req.userId = '1234'
        const response = await request(app).post('/create').send(req);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid userId format")
    });

});

describe('[History Service] - /add/:id', () => {
    let question

    beforeEach(async () => {
        question = JSON.parse(JSON.stringify(baseQuestion));
        const save = JSON.parse(JSON.stringify(baseSave));
        save.questions.push(question);
        saveId = await addSave(save);
    });

    it('Should return 200 when added', async () => {
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Question added successfully");
    });


    it('Should return 400 when missing last', async () => {
        delete question.last
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field last");
    });

    it('Should return 400 when missing statement', async () => {
        delete question.statement
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field statement");
    });

    it('Should return 400 when missing options', async () => {
        delete question.options
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field options");
    });

    it('Should return 400 when missing answer', async () => {
        delete question.answer
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field answer");
    });

    it('Should return 400 when missing correct', async () => {
        delete question.correct
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field correct");
    });

    it('Should return 400 when missing time', async () => {
        delete question.time
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field time");
    });

    it('Should return 400 when missing points', async () => {
        delete question.points
        const response = await request(app).post(`/add/${saveId}`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing field points");
    });

    it('Should return 400 when id is invalid', async () => {
        const response = await request(app).post(`/add/1234`).send(question);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid id format");
    });

});

describe('[History Service] - /get/:userId/', () => {
    let save

    beforeEach(async () => {
        save = JSON.parse(JSON.stringify(baseSave));
        save.questions.push(baseQuestion);
        saveId = await addSave(save);
    });

    it('Should return 200 when obtained', async () => {
        const response = await request(app).get(`/get/${save.userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('saves');
    });

    it('Should return 400 when invalid userId', async () => {
        save.userId = '1234'
        const response = await request(app).get(`/get/${save.userId}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid userId format");
    });

});

describe('[History Service] - /get/:userId/:id', () => {
    let save

    beforeEach(async () => {
        save = JSON.parse(JSON.stringify(baseSave))
        save.questions.push(baseQuestion);
        saveId = await addSave(save);
    });

    it('Should return 200 when obtained', async () => {
        const response = await request(app).get(`/get/${save.userId}/${saveId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('userId', '123456789012345678901234');
        expect(response.body).toHaveProperty('category', 'Capitals');
    });


    it('Should return 400 when invalid id', async () => {
        const response = await request(app).get(`/get/${save.userId}/1234`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid id format");
    });

    it('Should return 404 when save not found', async () => {
        save.userId = '234567890123456789012345'
        const response = await request(app).get(`/get/${save.userId}/${saveId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Save not found");
    });

    it('Should return 400 when invalid userId', async () => {
        save.userId = '1234'
        const response = await request(app).get(`/get/${save.userId}/${saveId}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid userId format");
    });

});

describe('[History Service] - /ranking/:n', () => {

    beforeEach(async () => {
        const save = JSON.parse(JSON.stringify(baseSave));
        save.finished = true
        save.questions.push(baseQuestion);
        saveId = await addSave(save);
    })

    it('Should return 200 when obtained', async () => {
        const response = await request(app).get(`/ranking/1`);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty('userId');
        expect(response.body[0]).toHaveProperty('totalPoints', baseQuestion.points);
        expect(response.body[0]).toHaveProperty('totalTime', baseQuestion.time);
        expect(response.body[0]).toHaveProperty('category', baseSave.category);
        expect(response.body[0]).toHaveProperty('correct', 0);
    });

    it('Should return 400 when invalid value for n', async () => {
        const response = await request(app).get(`/ranking/a`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", 'Invalid value for n');
    });
});


