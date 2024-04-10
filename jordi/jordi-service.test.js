const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Question = require('./jordi-model');
const axios = require('axios');
const error = require('mongoose/lib/error');

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

const getQuestions = () => {
	let questions = []
	for (let i = 0; i < 5; i++) {
		questions.push({
			"question": {
				"xml:lang": "en",
				"type": "literal",
				"value": `Question ${i}`
			},
			"answer": {
				"xml:lang": "en",
				"type": "literal",
				"value": `Statemnet ${i}`,
			}
		})
	}
	return questions;
}

describe("[Jordi Service] - /categories", () => {
  it("Should return 200 and an array of categories", async () => {

	const MockAdapter = require('axios-mock-adapter');

	const mock = new MockAdapter(axios);

	mock.onGet("https://query.wikidata.org/sparql?query=%0A%20%20%20%20%20%20%20%20SELECT%20DISTINCT%20%3Fquestion%20%3Fanswer%0A%20%20%20%20%20%20%20%20WHERE%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Fentity%20wdt%3AP31%20wd%3AQ6256%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP36%20%3Furl%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20rdfs%3Alabel%20%3Fquestion.%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Furl%20rdfs%3Alabel%20%3Fanswer.%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20FILTER(LANG(%3Fquestion)%20%3D%20'en')%20FILTER(LANG(%3Fanswer)%20%3D%20'en')%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20&format=json").reply(500, { error: "Internal Server Error" });

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