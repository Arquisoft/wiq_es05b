const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const User = require('../auth-model');
const mongoose = require('mongoose');

let mongoServer;
let app;

//test user
const user = {
  username: 'testuser',
  password: 'testpassword',
};

async function addUser(user){
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await mongoose.connect(process.env.MONGODB_URI);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });
  await newUser.save();
  await mongoose.connection.close()
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  app = require('../auth-service');
  //Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('[Auth Service] - /login', () => {

  it('Should return 200 with succesful login', async () => {
    const response = await request(app).post('/login').send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('userId');
  });

  it("Should return 401 when login fails", async () => {
    const response = await request(app).post('/login').send({username: "user", "password": "a"})

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  })

  it("Should return 400 when username not present", async () => {
    const response = await request(app).post('/login').send({"password": "a"})

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing username');
  })

  it("Should return 400 when password not present", async () => {
    const response = await request(app).post('/login').send({"username": "a"})

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing password');
  })
});

describe("[Auth Service] - /validate/:token", () => {
  let token
  let userId
  beforeAll(async () => {
    const loginData = await request(app).post('/login').send(user);
    token = loginData.body.token;
    userId = loginData.body.userId;
  })

  it("Should return 200 and valid:true with a valid token", async () => {
    const response = await request(app).get(`/validate/${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('valid', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('userId', userId);
  })
  it("Should return 200 and valid:false with a short token", async () => {
    const response = await request(app).get(`/validate/${token.slice(0, -1)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('valid', false);
  })
  it("Should return 200 and valid:false with a long token", async () => {
    const response = await request(app).get(`/validate/${token}a`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('valid', false);
  })
  it("Should return 200 and valid:false with a modified token", async () => {
    let newChar = 'a'
    if (token.slice(-1) === 'a') newChar = 'b';
    const response = await request(app).get(`/validate/${token.slice(0, -1)}${newChar}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('valid', false);
  })
})
