const request = require('supertest');
const axios = require('axios');
let app = require('./gateway-service');

beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
})
afterAll(async () => {
    app.close();
});

jest.mock('axios');

/*Auth service tests*/

describe('[Gateway Service] - /login', () => {

    it('should repsond with 200 after a successful login', async () => {
        // Mock responses from external service
        // mockAxios.onPost("/login").reply(200, {token: 'mockedToken', username: "testuser", userId: "1234"})
        axios.post.mockImplementation((url, data) => {
            return Promise.resolve({data: {token: 'mockedToken', username: "testuser", userId: "1234"}});
        });

        const response = await request(app)
            .post('/login')
            .send({username: 'testuser', password: 'testpassword'});

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token", 'mockedToken');
        expect(response.body).toHaveProperty("username", 'testuser');
        expect(response.body).toHaveProperty("userId", '1234');
    });

    it('should repsond with 401 after a invalid login', async () => {
        // Mock responses from external service
        axios.post.mockImplementation((url, data) => {
            return Promise.reject({data:{error: "Invalid credentials"}, response: {status: 401}});
        });

        const response = await request(app)
            .post('/login')
            .send({username: 'testuser', password: 'testpassword'});

        expect(response.statusCode).toBe(401);
    });

});
describe('[Gateway Service] - /validate', () => {

    it('should respond with 200 after a successful token validation', async () => {

        // Mock responses from external service
        axios.get.mockImplementation((url, data) => {
            return Promise.resolve({data: {valid: true}});
        });

        const response = await request(app).get('/validate/faketoken');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("valid", true);
    });

    it('should respond with 200 due to an invalid token validation', async () => {
        // Mock responses from external service with a rejected value containing specific values
        const errorResponse = {data: {valid: false}};
        axios.get.mockImplementation((url, data) => {
            return Promise.resolve(errorResponse);
        });

        const response = await request(app).get('/validate/faketoken');

        // Assertions
        expect(response.statusCode).toBe(200);
    });

});

/* Jordi service tests */

describe('[Gateway Service] - /game/categories', () => {
    it('should return categories with valid token', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        axios.get.mockResolvedValueOnce({status: 200, data: {categories: ['category1', 'category2']}});

        const res = await request(app)
            .get('/game/categories')
            .send({token: 'validToken'});

        expect(res.status).toBe(200);
        expect(res.body).toEqual({categories: ['category1', 'category2']});
    });
});

describe('[Gateway Service] - /game/questions/:category/:n', () => {
    it('should return questions from jordi service', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: [{question: 'question1', answer: 'a'}, {question: 'question2', answer: 'b'}]
        });

        const res = await request(app)
            .get('/game/questions/categoryMock/2')
            .send({token: 'validToken'});

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{"question": "question1"}, {"question": "question2"}]);
    });
});

describe('[Gateway Service] - /game/answer', () => {
    it('should return 200 status with 100 points for a correct answer', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get question request
        axios.get.mockResolvedValueOnce({data: {answer: 'a'}});
        // Save question in historic
        axios.post.mockResolvedValueOnce({answer: 'a', points: '100'});

        const reqBody = {
            questionId: 'questionId',
            last: 'last',
            answer: 'a',
            time: 'time',
            saveId: 'saveId',
            statement: 'statement',
            options: ['a', 'b']
        }

        const res = await request(app)
            .post('/game/answer')
            .send(reqBody);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("answer", 'a');
        expect(res.body).toHaveProperty("points", 100);

    });

    it('should return 200 status with -100 points for a wrong answer', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get question request
        axios.get.mockResolvedValueOnce({data: {answer: 'a'}});
        // Save question in historic
        axios.post.mockResolvedValueOnce({answer: 'a', points: '100'});

        const reqBody = {
            questionId: 'questionId',
            last: 'last',
            answer: 'b',
            time: 'time',
            saveId: 'saveId',
            statement: 'statement',
            options: ['a', 'b']
        }

        const res = await request(app)
            .post('/game/answer')
            .send(reqBody);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("answer", 'a');
        expect(res.body).toHaveProperty("points", -10);

    });

    it('should return 400 status since there are missing fields', async () => {

        //Auth middleware request
        axios.get.mockResolvedValueOnce({data: {valid: true, data: {userId: "mockedUserId"}}})
        // Get question request
        axios.get.mockResolvedValueOnce({data: {answer: 'a'}});
        // Save question in historic
        axios.post.mockResolvedValueOnce({answer: 'a', points: '100'});

        const reqBody = {
            questionId: 'questionId',
            last: 'last',
            answer: 'b',
            time: 'time'
        }

        const res = await request(app)
            .post('/game/answer')
            .send(reqBody);

        expect(res.status).toBe(400);
    });
});

/* User service tests */
describe('[Gateway Service] - /user/:userId', () => {
    it('should return 200 status and the user', async () => {
        // Get user from users service
        axios.get.mockImplementation(() => Promise.resolve({data: {username: "Berengario"}}));

        const res = await request(app).get('/user/mockedUserId');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", 'Berengario');
    });
})

/* History service tests */
describe('[Gateway Service] - /history/get/:userId', () => {
    it('should return 200 and the history for the user', async () => {

        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "mockedUserId"}}})
            if (url.includes("/get/mockedUserId")) return Promise.resolve({data: {history: 'mockHistory'}, status: 200})
        })

        const res = await request(app)
          .get('/history/get/mockedUserId')
          .set('Authorization', 'Bearer your_token');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("history", 'mockHistory');
    });
})
describe('[Gateway Service] - /history/get/:userId/:id', () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "id1"}}})
            if (url.includes("/get/id1")) return Promise.resolve({data: {success: true}, status: 200})
            if (url.includes("/social/friends/")) return Promise.resolve({data: [{user1: {_id: "id1"}, user2: {_id: "id2"}}]})
        })
    })

    it("should return 200 and a user game", async () => {
        const res = await request(app)
          .get('/history/get/id1/id2')
          .set('Authorization', 'Bearer your_token');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})
describe('[Gateway Service] - /history/create', () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "id1"}}})
            if (url.includes("/social/friends/")) return Promise.resolve({data: [{user1: {_id: "id1"}, user2: {_id: "id2"}}]})
        })
        axios.post.mockImplementation((url, data) => {
            if (url.includes("/create")) return Promise.resolve({data: {success: true, data: {userId: "id1"}}, status: 200})
        })
    })

    it("should return 200 and a create a game", async () => {
        const res = await request(app)
          .post('/history/create')
          .set('Authorization', 'Bearer your_token')
          .send({userId: "id1", category: "category"});
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})
describe("[Gateway Service] - /history/add/:id", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "id1"}}})
            if (url.includes("/social/friends/")) return Promise.resolve({data: [{user1: {_id: "id1"}, user2: {_id: "id2"}}]})
        })
        axios.post.mockImplementation((url, data) => {
            if (url.includes("/add")) return Promise.resolve({data: {success: true}, status: 200})
        })
    })

    it("should return 200 and save the question to the game", async () => {
        const res = await request(app)
          .post('/history/add/:id')
          .set('Authorization', 'Bearer your_token')
          .send({
              last: "foo",
              statement: "foo",
              options: "foo",
              answer: "foo",
              correct: "foo",
              time: "foo",
              points: "foo"
          });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /ranking/:n", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "id1"}}})
            if (url.includes("/social/friends/")) return Promise.resolve({data: [{user1: {_id: "id1"}, user2: {_id: "id2"}}]})
            if (url.includes("/user")) return Promise.resolve({data: {username: "foo"}})
            if (url.includes("/ranking")) return Promise.resolve({data: [{userId: "foo", user: "bar"}], status: 200})
        })
    })

    it("should return 200 and fetch the ranking", async () => {
        const res = await request(app)
          .get('/ranking/10')
          .set('Authorization', 'Bearer your_token')
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("user", "foo");
    })
})

describe("[Gateway Service] - /admin/gen/:groupId", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "foo"}}})
            if (url.includes("/gen")) return Promise.resolve({data: {success: true}, status: 200})
            if (url.includes("/user/foo")) return Promise.resolve({data: {username: "admin"}})
        })
    })

    it("should return 200 and generate the data", async () => {
        const res = await request(app)
          .get('/admin/gen/bar')
          .set('Authorization', 'Bearer your_token')
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /admin/gen", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "foo"}}})
            if (url.includes("/gen")) return Promise.resolve({data: {success: true}, status: 200})
            if (url.includes("/user/foo")) return Promise.resolve({data: {username: "admin"}})
        })
    })

    it("should return 200 and generate the data", async () => {
        const res = await request(app)
          .get('/admin/gen')
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /admin/groups", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "foo"}}})
            if (url.includes("/groups")) return Promise.resolve({data: {success: true}, status: 200})
            if (url.includes("/user/foo")) return Promise.resolve({data: {username: "admin"}})
        })
    })

    it("should return 200 and generate the data", async () => {
        const res = await request(app)
          .get('/admin/groups')
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})


describe("[Gateway Service] - /admin/addGroups", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "foo"}}})
            if (url.includes("/user/foo")) return Promise.resolve({data: {username: "admin"}})
        })
        axios.post.mockImplementation((url, data) => {
            if (url.includes("/addGroups")) return Promise.resolve({data: {success: true}, status: 200})
        })
    })

    it("should return 200 and add the groups", async () => {
        const res = await request(app)
          .post('/admin/addGroups')
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})


describe("[Gateway Service] - /admin/removeGroup/:groupId", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "foo"}}})
            if (url.includes("removeGroup")) return Promise.resolve({data: {success: true}, status: 200})
            if (url.includes("/user/foo")) return Promise.resolve({data: {username: "admin"}})
        })
    })

    it("should return 200 and remove the group data", async () => {
        const res = await request(app)
          .get('/admin/removeGroup/foo')
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})


describe("[Gateway Service] - /admin/removeAllGroups", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url, data) => {
            if (url.includes("/validate")) return Promise.resolve({data: {valid: true, data: {userId: "foo"}}})
            if (url.includes("/removeAllGroups")) return Promise.resolve({data: {success: true}, status: 200})
            if (url.includes("/user/foo")) return Promise.resolve({data: {username: "admin"}})
        })
    })

    it("should return 200 and remove all groups", async () => {
        const res = await request(app)
          .get('/admin/removeAllGroups')
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /adduser", () => {

    beforeEach(() => {
        axios.post.mockImplementation(() => Promise.resolve({data: {message: "User added"}, status: 200}));
    })

    it("should return 200 and add the user to the system", async () => {
        const res = await request(app)
          .post('/adduser')
          .send({
              username: "foo",
              password: "Baaaaaar6)"
          })

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "User added");
    })
})

describe("[Gateway Service] - /users/serach/:filter", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and the searched user", async () => {
        const res = await request(app)
          .get('/users/search/foo')
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /users/social/sendrequest", () => {
    beforeEach(() => {
        axios.post.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and send the request to the desired user", async () => {
        const res = await request(app)
          .post('/users/social/sendrequest')
          .send({ userId: "foo" })

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /users/social/sentrequests/:userId", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and retrieve the friend requests", async () => {
        const res = await request(app)
          .get('/users/social/sentrequests/foo')

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /users/social/receivedrequests/:userId", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and retrieve the recieved friend requests", async () => {
        const res = await request(app)
          .get('/users/social/receivedrequests/foo')

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /users/social/acceptrequest/:fromId/:userId", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and accept the friend request", async () => {
        const res = await request(app)
          .get('/users/social/acceptrequest/foo/bar')

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /users/social/friends/:userId", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and show the friend data", async () => {
        const res = await request(app)
          .get('/users/social/friends/foo')

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /users/social/removefriend", () => {
    beforeEach(() => {
        axios.post.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and remove the friend", async () => {
        const res = await request(app)
          .post('/users/social/removefriend')
          .send({userId: "bar"})

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

describe("[Gateway Service] - /users/social/rejectrequest", () => {
    beforeEach(() => {
        axios.post.mockImplementation(() => Promise.resolve({data: {success: true}, status: 200}))
    })

    it("should return 200 and remove the friend", async () => {
        const res = await request(app)
          .post('/users/social/rejectrequest')
          .send({userId: "bar"})

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    })
})

const express = require('express');
const routes = require('./routes/gatewayRoutes');

let app2 = express();
app2.use(express.json());
routes(app2);

describe('Routes', () => {
    it('returns OK status for health check', async () => {
        const res = await request(app2).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ status: "OK" });
    });

    it('returns teapot status for root path', async () => {
        const res = await request(app2).get('/');
        expect(res.statusCode).toEqual(418);
        expect(res.body).toEqual({ message: "¯\_(ツ)_/¯" });
    });
});