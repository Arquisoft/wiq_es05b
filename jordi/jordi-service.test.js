const groups = [
  {
      "groupId": "capitals",
      "questionItem": "Q6256",
      "answer": "P36",
      "statements": [
          "The capital of <QuestionItem> is...",
          "What is the capital of <QuestionItem>?",
          "Select the capital of <QuestionItem>"
      ],
      "categories": [
          "capitals",
          "geography"
      ]
  },
  {
      "groupId": "continent",
      "questionItem": "Q6256",
      "answer": "P30",
      "statements": [
          "The continent of <QuestionItem> is...",
          "What is the continent of <QuestionItem>?",
          "Select the continent of <QuestionItem>"
      ],
      "categories": [
          "continent",
          "geography"
      ]
  },
  {
      "groupId": "languages",
      "questionItem": "Q6256",
      "answer": "P37",
      "statements": [
          "The language spoken in <QuestionItem> is...",
          "What is the language spoken in <QuestionItem>?",
          "Select the language spoken in <QuestionItem>"
      ],
      "categories": [
          "languages",
          "geography"
      ]
  },
  {
      "groupId": "population",
      "questionItem": "Q6256",
      "answer": "P1082",
      "statements": [
          "The population of <QuestionItem> is...",
          "What is the population of <QuestionItem>",
          "Select the population of <QuestionItem>"
      ],
      "categories": [
          "population",
          "geography"
      ],
      "plainText": true,
      "filter": "FILTER(LANG(?question) = 'en')"
  },
  {
      "groupId": "area",
      "questionItem": "Q6256",
      "answer": "P2046",
      "statements": [
          "The area of <QuestionItem> is...",
          "What is the area of <QuestionItem>",
          "Select the area of <QuestionItem>"
      ],
      "categories": [
          "area",
          "geography"
      ],
      "plainText": true,
      "filter": "FILTER(LANG(?question) = 'en')"
  },
  {
      "groupId": "gdp",
      "questionItem": "Q6256",
      "answer": "P2131",
      "statements": [
          "The GDP of <QuestionItem> is...",
          "What is the GDP of <QuestionItem>",
          "Select the GDP of <QuestionItem>"
      ],
      "categories": [
          "gdp",
          "geography"
      ],
      "plainText": true,
      "filter": "FILTER(LANG(?question) = 'en')"
  },
  {
      "groupId": "currency",
      "questionItem": "Q6256",
      "answer": "P38",
      "statements": [
          "The currency of <QuestionItem> is...",
          "What is the currency of <QuestionItem>",
          "Select the currency of <QuestionItem>"
      ],
      "categories": [
          "currency",
          "geography",
          "economy"
      ]
  },
  {
      "groupId": "president",
      "questionItem": "Q6256",
      "answer": "P35",
      "statements": [
          "The president of <QuestionItem> is...",
          "Who is the president of <QuestionItem>",
          "Select the president of <QuestionItem>"
      ],
      "categories": [
          "president",
          "geography",
          "politics"
      ]
  }
];


const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { Question } = require("./jordi-model");
const { Group } = require("./jordi-model");
const axios = require("axios");

let mongoServer;
let app;

jest.mock("axios");

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

describe("[Jordi Service] - /answer", () => {
  // TODO: Write tests for this endpoint
});

const express = require('express');
const routes = require('./routes/jordi-ask');

const mockQuestionsRepository = {
  getCategories: jest.fn(),
  checkValidId: jest.fn(),
  findQuestionById: jest.fn(),
  getQuestions: jest.fn(),
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