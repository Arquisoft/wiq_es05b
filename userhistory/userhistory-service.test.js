const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Save = require('./history-model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

let mongoServer;
let app;

//test user
const save = {
    userId: '12345',
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

describe('[History Service] - /create', () => {

    it('Should return 201 when created', async () => {
      const response = await request(app).post('/create').send(save);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

});