const request = require('supertest');
const bcrypt = require('bcrypt');
const express = require('express');
const routes = require('./socialRoutes');

const mockSocialRepository = {
  insertRequest: jest.fn(),
  getSentRequests: jest.fn(),
  getReceivedRequests: jest.fn(),
  deleteRequest: jest.fn(),
  insertFriendship: jest.fn(),
  getFriendships: jest.fn(),
  deleteFriendship: jest.fn(),
};

const mockUserRepository = {
  getUser: jest.fn()
};


const app = express();
app.use(express.json());
app.set("i18next", require("i18next"))
routes(app, mockUserRepository, mockSocialRepository);

describe('Social Routes', () => {
  it("adds a new social request with valida data", async () => {
    mockSocialRepository.insertRequest.mockResolvedValue({ message: "Friend request added successfully" });
    const res = await request(app).post("/social/sendrequest").send({ name: "name", userId: "userId", toId: "toId" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Friend request added successfully" );
  })
  it("returns the friend requests sent by a user", async () => {
    mockSocialRepository.getSentRequests.mockResolvedValue([{ _doc: {from: "from", to: "to", __v: "foo"}}]);
    const res = await request(app).get("/social/sentrequests/userId");

    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty("from", "from");
    expect(res.body[0]).toHaveProperty("to", "to");

  })
  it("returns the friend requests received by a user", async () => {
    mockSocialRepository.getReceivedRequests.mockResolvedValue([{ _doc: {from: "from", to: "to", __v: "foo"}}]);
    const res = await request(app).get("/social/receivedrequests/userId");

    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty("from", "from");
    expect(res.body[0]).toHaveProperty("to", "to");
  })
  it("accepts a friend request", async () => {
    mockSocialRepository.deleteRequest.mockResolvedValue();
    mockSocialRepository.insertFriendship.mockResolvedValue({success: true});
    const res = await request(app).get("/social/acceptrequest/foo/bar");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
  })
  it("returns the friends of a user", async () => {
    mockSocialRepository.getFriendships.mockResolvedValue([{users: ["foo", "bar"]}]);
    mockUserRepository.getUser.mockResolvedValue({password: "bar", __v: 1, username:"foo"});
    const res = await request(app).get("/social/friends/foo");

    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty("user1", {username: "foo"});
    expect(res.body[0]).toHaveProperty("user2", {username: "foo"});
  })
  it("removes a friend of the user", async () => {
    mockSocialRepository.deleteFriendship.mockResolvedValue({success: true});
    const res = await request(app).post("/social/removefriend/").send({user2: "foo", userId: "bar"});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
  })
  it("rejects a friend request", async () => {
    mockSocialRepository.deleteRequest.mockResolvedValue({success: true});
    const res = await request(app).post("/social/rejectrequest/").send({fromId: "foo", userId: "bar"});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
  })
});