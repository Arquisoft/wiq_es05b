const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("./user-model")

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  app = require('./user-service');
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

const removeAllUsers = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await mongoose.connection.close();
}

async function addUser(user){
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await mongoose.connect(process.env.MONGODB_URI);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });
  const u = await newUser.save();
  await mongoose.connection.close()
  return u
}

describe('[User Service] - /adduser', () => {
  it('Should return 200 and add a message on succesful POST', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', "User created successfully");
  });
  it("Should return 400 when username already exists", async () => {
    const firstRequest = await request(app).post("/adduser").send({username: "a", password: "a"})
    expect(firstRequest.status).toBe(200);

    const secondRequest = await request(app).post("/adduser").send({username: "a", password: "a"})
    expect(secondRequest.status).toBe(400);
    expect(secondRequest.body).toHaveProperty("error", "Username already exists");
  })
});

describe('[User Service] - /user/:userId', () => {
  let userId
  let date
  beforeAll(async () => {
    await removeAllUsers()
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    }

    const { _id, createdAt } = await addUser(newUser);
    userId = _id
    date = createdAt
  })

  it("Should return 200 and user data if the user exists", async () => {
    const response = await request(app).get(`/user/${userId}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("username", "testuser")
    expect(response.body).toHaveProperty("createdAt", date.toISOString())
  })
  it("Should return 400 if the user id is an invalid ObjectId (long)", async () => {
    const response = await request(app).get(`/user/${userId}1`)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error", "Invalid id format")
  })
  it("Should return 400 if the user id is an invalid ObjectId (short)", async () => {
    const response = await request(app).get(`/user/${userId.toString().slice(0, -1)}`)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("error", "Invalid id format")
  })
  it("Should return 404 if the user does not exists", async () => {
    let newChar = 'a'
    if (userId.toString().slice(-1) === 'a') newChar = 'b';
    const response = await request(app).get(`/user/${userId.toString().slice(0, -1)}${newChar}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty("error", "User not found")
  })
})


