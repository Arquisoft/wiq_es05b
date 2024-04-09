const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Save = require('./history-model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

let mongoServer;
let app;

let save = {
    userId: '012345678901234567890123',
    category: 'Capitals',
};

async function addSave(user){
    await mongoose.connect(process.env.MONGODB_URI);
    const newSave = new Save({
        userId: new ObjectId(12345),
        category: 'Capitals',
      });
    await newSave.save();
    await mongoose.connection.close()
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

beforeEach(async () => {
    save = {
        userId: '012345678901234567890123',
        category: 'Capitals',
    };
});

describe('[History Service] - /create', () => {

    it('Should return 201 when created', async () => {
      const response = await request(app).post('/create').send(save);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('Should return 400 when missing userId', async () => {
        save.userId = null
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Missing userId")
    });

    it('Should return 400 when missing category', async () => {
        save.category = null
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

    /** TODO: fix after asking about isValidObjectId
    it('Should return 400 when userId is invalid', async () => {
        save.userId = 1234
        const response = await request(app).post('/create').send(save);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid userId format")
    });
    */
});