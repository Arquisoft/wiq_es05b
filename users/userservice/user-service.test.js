const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("./user-model")
const FriendRequest = require("./friendRequest-model")
const Friend = require("./friendship-model")

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
}

const removeAllFr = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await FriendRequest.deleteMany({});
}

const removeAllF = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Friend.deleteMany({});
}

async function addUser(user){
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await mongoose.connect(process.env.MONGODB_URI);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });
  return await newUser.save()
}

async function addFriendRequest(fr){
  await mongoose.connect(process.env.MONGODB_URI);
  const newFr = new FriendRequest(fr);
  return await newFr.save()
}

async function addFriends(fr){
  await mongoose.connect(process.env.MONGODB_URI);
  const newF = new Friend(fr);
  return await newF.save()
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

describe("[User Service] - /users/search/:filter", () => {
  beforeAll(async () => {
    await removeAllUsers()
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    }

    await addUser(newUser);
  })

  it("Should return 200 and all the users", async () => {
    const response = await request(app).get(`/users/search/all`)

    expect(response.status).toBe(200)
    expect(response.body[0]).toHaveProperty("username", "testuser")
  })
})

describe("[User Service] - /social/sendrequest", () => {

  it("Should return 200 and all the users", async () => {
    const response = await request(app)
      .post(`/social/sendrequest`)
      .send({
        name: "foo",
        userId: new mongoose.Types.ObjectId(new Uint8Array(12)).toString(),
        toId: new mongoose.Types.ObjectId(new Uint8Array(12)).toString()
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("message", "Friend request added successfully")
  })
})

describe("[User Service] - /social/sentrequests/:userId", () => {

  let targetId
  let objectiveId

  beforeAll(async () => {
    await removeAllFr()
    await removeAllUsers()
    const target = await addUser({
      username: "foo",
      password: "foo"
    })
    targetId = target._id
    const objective = await addUser({
      username: "bar",
      password: "bar"
    })
    objectiveId = objective._id
    addFriendRequest({
      from: { username: "foo", userId: targetId },
      to: { userId: objectiveId }
    })
  })

  it("Should return 200 and the sent friend requests", async () => {
    const response = await request(app)
      .get(`/social/sentrequests/${targetId}`)

    expect(response.status).toBe(200)
    expect(response.body[0]).toHaveProperty("from", {username: "foo", userId: targetId.toString()})
    expect(response.body[0]).toHaveProperty("to", {userId: objectiveId.toString()})
  })
})

describe("[User Service] - /social/receivedrequests/:userId", () => {

  let targetId
  let objectiveId

  beforeAll(async () => {
    await removeAllFr()
    await removeAllUsers()
    const target = await addUser({
      username: "foo",
      password: "foo"
    })
    targetId = target._id
    const objective = await addUser({
      username: "bar",
      password: "bar"
    })
    objectiveId = objective._id
    addFriendRequest({
      from: { username: "foo", userId: targetId },
      to: { userId: objectiveId }
    })
  })

  it("Should return 200 and return the received requests", async () => {
    const response = await request(app)
      .get(`/social/receivedrequests/${objectiveId}`)

    expect(response.status).toBe(200)
    expect(response.body[0]).toHaveProperty("from", {username: "foo", userId: targetId.toString()})
    expect(response.body[0]).toHaveProperty("to", {userId: objectiveId.toString()})
  })
})

describe("[User Service] - /social/acceptrequest/:fromId/:toId", () => {

  let targetId
  let objectiveId

  beforeAll(async () => {
    await removeAllFr()
    await removeAllUsers()
    const target = await addUser({
      username: "foo",
      password: "foo"
    })
    targetId = target._id
    const objective = await addUser({
      username: "bar",
      password: "bar"
    })
    objectiveId = objective._id
    addFriendRequest({
      from: { username: "foo", userId: targetId },
      to: { userId: objectiveId }
    })
  })

  it("Should return 200 and accept the request", async () => {
    const response = await request(app)
      .get(`/social/acceptrequest/${targetId}/${objectiveId}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("message", "Friendship added successfully")
  })
})
describe("[User Service] - /social/friends/:userId", () => {

  let targetId
  let objectiveId

  beforeAll(async () => {
    await removeAllF()
    await removeAllUsers()
    const target = await addUser({
      username: "foo",
      password: "foo"
    })
    targetId = target._id
    const objective = await addUser({
      username: "bar",
      password: "bar"
    })
    objectiveId = objective._id
    await addFriends({users: [targetId, objectiveId]})
  })

  it("Should return 200 and return the user friends", async () => {
    const response = await request(app)
      .get(`/social/friends/${targetId}`)

    expect(response.status).toBe(200)
    expect(response.body[0].user1).toHaveProperty("_id", targetId.toString())
    expect(response.body[0].user1).toHaveProperty("username", "foo")
    expect(response.body[0].user2).toHaveProperty("_id", objectiveId.toString())
    expect(response.body[0].user2).toHaveProperty("username", "bar")
  })
})
describe("[User Service] - /social/removefriend", () => {

  let targetId
  let objectiveId

  beforeAll(async () => {
    await removeAllF()
    await removeAllUsers()
    const target = await addUser({
      username: "foo",
      password: "foo"
    })
    targetId = target._id
    const objective = await addUser({
      username: "bar",
      password: "bar"
    })
    objectiveId = objective._id
    await addFriends({users: [targetId, objectiveId]})
  })

  it("Should return 200 and remove the friendship", async () => {
    const response = await request(app)
      .post(`/social/removefriend/`)
      .send({
        userId: targetId,
        user2: objectiveId
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("message", "Friendship deleted successfully")
  })
})
describe("[User Service] - /social/rejectrequest", () => {

  let targetId
  let objectiveId

  beforeAll(async () => {
    await removeAllFr()
    await removeAllUsers()
    const target = await addUser({
      username: "foo",
      password: "foo"
    })
    targetId = target._id
    const objective = await addUser({
      username: "bar",
      password: "bar"
    })
    objectiveId = objective._id
    addFriendRequest({
      from: { username: "foo", userId: targetId },
      to: { userId: objectiveId }
    })
  })

  it("Should return 200 and remove the request", async () => {
    const response = await request(app)
      .post(`/social/rejectrequest/`)
      .send({
        fromId: targetId,
        userId: objectiveId
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("message", "Friend request deleted successfully")
  })
})
