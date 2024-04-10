const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Question = require('./jordi-model');
const axios = require('axios');

let mongoServer;
let app;

jest.mock('axios');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  app = require('./jordi-service');
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

afterEach(async () => {
  axios.get.mockReset()
  await clearQuestions()
})

const getQuestion = () => {
  let questions = []
  for(let i = 0; i < 5; i++) {
    questions.push({
      "question" : {
        "xml:lang" : "en",
        "type" : "literal",
        "value" : `Question ${i}`
      },
      "answer" : {
        "xml:lang" : "en",
        "type" : "literal",
        "value" : `Statemnet ${i}`,
      }
    })
  }
 return { data: { results: { bindings: questions } } }
}
const clearQuestions = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Question.deleteMany({});
  await mongoose.connection.close();
}

describe("[Jordi Service] - /categories", () => {
  it("Should return 200 and an array of categories", async () => {
    axios.get.mockResolvedValue(getQuestion())

    const response = await request(app).get('/categories')
    expect(response.status).toBe(200)
    // expect(response.body).toHaveProperty("categories", categories)
  })
  it("Should return 200 and an empty array of categories if the database is empty", () => {

  })
})

describe("[Jordi Service] - /questions/:category/:n", () => {

})

describe("[Jordi Service] - /answer", () => {

})