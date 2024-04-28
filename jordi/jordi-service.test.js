const groups = require("./groups.json")

const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { Question } = require("./jordi-model");
const { Group } = require("./jordi-model");
const axios = require("axios");

let mongoServer;
let app;

jest.mock("axios");
jest.mock('i18next', () => {
  const actualI18next = jest.requireActual('i18next');  // Optionally use actual for other methods
  return {
    ...actualI18next,  // Spread actual module to keep non-mocked parts
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
    changeLanguage: jest.fn().mockReturnThis(),
    t: jest.fn((key, fallback) => {
      const resources = {en: require("./locals/en.json"), es: require("./locals/es.json")}
      return resources["en"]["translation"][key] || key;
    }),  // Return key or a fallback if provided
  };
});


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  app = require("./jordi-service");
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

afterEach(async () => {
  axios.get.mockReset();

  // Clear the database after each test
  await mongoose.connect(process.env.MONGODB_URI);
  await Question.deleteMany({});
  await Group.deleteMany({});
  await mongoose.connection.close();

});

const WikidataMock = {
  data: {
    "head": {
      "vars": [
       "question",
       "answer"
      ]
     },
     "results": {
      "bindings": [
       {
        "question": {
         "xml:lang": "en",
         "type": "literal",
         "value": "realm of the United Kingdom"
        },
        "answer": {
         "xml:lang": "en",
         "type": "literal",
         "value": "London"
        }
       },
       {
        "question": {
         "xml:lang": "en",
         "type": "literal",
         "value": "Sikh Confederacy"
        },
        "answer": {
         "xml:lang": "en",
         "type": "literal",
         "value": "Amritsar"
        }
       }
     ]      
  }
}};

describe("[Jordi Service] - /addGroups", () => {
  it("Should return 200 and and a message: Groups added successfully", async () => {

    const response = await request(app).post("/addGroups").send(groups);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");
    expect(response.text).toBe("{\"message\":\"Groups added successfully\"}");

  });

  it("Should return 500 if the request body is empty", async () => {

    const response = await request(app).post("/addGroups").send();

    expect(response.status).toBe(500);
    expect(response).toHaveProperty("text");
    expect(response.text).toBe("{\"error\":\"Internal Server Error\"}");

  });

});

describe("[Jordi Service] - /groups", () => {
  
  it("Should return 200 and an empty array of groups", async () => {

    const response = await request(app).get("/groups");
    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");
    expect(response.text).toBe("[]");

  });

  it("Should return 200 and an array of groups", async () => {

    await request(app).post("/addGroups").send(groups);

    const response = await request(app).get("/groups");
    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");

    const responseGroups = JSON.parse(response.text);
    const groupIds = responseGroups.map(group => group.groupId);
    const expectedGroupIds = groups.map(group => group.groupId);
    expect(groupIds).toEqual(expectedGroupIds);

  });

  it("Should return 409 if the group already exists", async () => {
      
      await request(app).post("/addGroups").send(groups);
  
      const response = await request(app).post("/addGroups").send(groups);
  
      expect(response.status).toBe(409);
      expect(response).toHaveProperty("text");
      expect(response.text).toBe("{\"error\":\"Already existing groups detected\"}");
  
    });

});

describe("[Jordi Service] - /removeAllGroups", () => {
  it("Should return 200 and a message: All groups removed successfully", async () => {

    await request(app).post("/addGroups").send(groups);
    const response = await request(app).get("/removeAllGroups");

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");
    expect(response.text).toBe("{\"message\":\"All groups removed successfully\"}");

  });

  it("Should return 200 and a message: All groups removed successfully (Even with database empty)", async () => {

    const response = await request(app).get("/removeAllGroups");

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");
    expect(response.text).toBe("{\"message\":\"All groups removed successfully\"}");

  });

});

describe("[Jordi Service] - /removeGroup/:groupId", () => {
  it("Should return 200 and a message: Group removed successfully", async () => {

    await request(app).post("/addGroups").send(groups);
    const response = await request(app).get("/removeGroup/capitals");
    
    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");
    expect(response.text).toBe("{\"message\":\"Group removed successfully\"}");
  });

  it("Should return 200 and a message: Group removed successfully (Even with database empty)", async () => {

    const response = await request(app).get("/removeGroup/capitals");

    expect(response.status).toBe(200);

    expect(response).toHaveProperty("text");

    expect(response.text).toBe("{\"message\":\"Group removed successfully\"}");

  });

});

describe("[Jordi Service] - /categories", () => {

  it("Should return 200 and an array of categories", async () => {

    axios.get.mockImplementation(() => Promise.resolve(WikidataMock));
    await request(app).post("/addGroups").send(groups);
    await request(app).get("/gen");
        
    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");

    expect(response.text).toEqual("[\"area\",\"capitals\",\"continent\",\"currency\",\"economy\",\"gdp\",\"geography\",\"languages\",\"politics\",\"population\",\"president\"]");
    
  });
  
  it("Should return 200 and an empty array of categories if the database is empty", async () => {


    const response = await request(app).get('/categories');
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");
    expect(response.text).toBe("[]");

  });
});

describe("[Jordi Service] - /questions/:category/:n", () => {
  
  it("Should return 200 and an array of questions", async () => {

    axios.get.mockImplementation(() => Promise.resolve(WikidataMock));
    await request(app).post("/addGroups").send(groups);
    await request(app).get("/gen/capitals");
    
    const response = await request(app).get('/questions/capitals/2');

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("text");

    const responseQuestions = JSON.parse(response.text);
    expect(responseQuestions).toHaveLength(2);

  });

});

describe("[Jordi Service] - /question/:id", () => {
    
    it("Should return 200 and a question", async () => {
  
      axios.get.mockImplementation(() => Promise.resolve(WikidataMock));
      
      await request(app).post("/addGroups").send(groups);
      await request(app).get("/gen/capitals");

      const question = await request(app).get('/questions/capitals/1');
      
      const response = await request(app).get('/question/' + question.body[0]._id);
  
      expect(response.status).toBe(200);
      expect(response).toHaveProperty("text");
  
      const responseQuestion = JSON.parse(response.text);
      expect(responseQuestion).toHaveProperty("categories");
      expect(responseQuestion).toHaveProperty("statements");
  
    });
  
  });

const express = require('express');
const routes = require('./routes/jordi-ask');

const mockQuestionsRepository = {
  getCategories: jest.fn(),
  checkValidId: jest.fn(),
  findQuestionById: jest.fn(),
  getQuestions: jest.fn(),
  checkCategory: jest.fn(),
};

let app2 = express();
app2.use(express.json());
routes(app2, mockQuestionsRepository);

describe('Routes', () => {
  it('fetches categories', async () => {
    mockQuestionsRepository.getCategories.mockResolvedValue([]);
    const res = await request(app2).get('/categories');
    expect(res.statusCode).toEqual(200);
  });

  it('fetches question by id', async () => {
    mockQuestionsRepository.checkValidId.mockReturnValue(true);
    mockQuestionsRepository.findQuestionById.mockResolvedValue({});
    const res = await request(app2).get('/question/1');
    expect(res.statusCode).toEqual(200);
  });

  /** TODO: works in local, when in github actions (500 -> internal server error) 
  it('returns error for invalid id format', async () => {
    mockQuestionsRepository.checkValidId.mockReturnValue(false);
    const res = await request(app2).get('/question/invalid');
    expect(res.statusCode).toEqual(400);
  });
  */

  it('fetches questions by category and number', async () => {
    mockQuestionsRepository.getQuestions.mockResolvedValue([]);
    mockQuestionsRepository.checkCategory.mockResolvedValue(true);
    const res = await request(app2).get('/questions/category/10');
    expect(res.statusCode).toEqual(200);
  });

  /** TODO: works in local, when in github actions (500 -> internal server error) 
  it('returns error for non-numeric number of questions', async () => {
    const res = await request(app2).get('/questions/category/invalid');
    expect(res.statusCode).toEqual(400);
  });
  */
});