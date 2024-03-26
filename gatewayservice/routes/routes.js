
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";
const questionServiceUrl = process.env.JORDI_ASK_SERVICE_URL || 'http://localhost:8003';
const rankingServiceUrl = process.env.RANKING_SERVICE_URL || 'http://localhost:8005';

module.exports = function(app, axios) {

  app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
  });

/* ----------------------------- Users Endpoints ---------------------------- */

  app.post("/login", async (req, res) => {
    try {
      // Forward the login request to the authentication service
      const authResponse = await axios.post(`${authServiceUrl}/login`, req.body);
      res.json(authResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  });

  app.post("/adduser", async (req, res) => {
    try {
      // Forward the add user request to the user service
      const {data} = await axios.post(`${userServiceUrl}/adduser`,req.body);
      
      const {data: d} = await axios.post(`${authServiceUrl}/login`, req.body)
      res.json({message: data.message, token: d.token, username: d.username})
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  });

/* ----------------------- Question related endpoints ----------------------- */

  app.get("/categories", async (_req, res) => {
    try {
      // Forward the get questions request to the user service
      const questionResponse = await axios.get(
        `${questionServiceUrl}/categories`
      );
      res.json(questionResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  });

  app.get("/questions/:category/:n", async (req, res) => {
    try {
      // Forward the get questions request to the user service
      const questionResponse = await axios.get(
        `${questionServiceUrl}/questions/${req.params.category}/${req.params.n}`
      );
      res.json(questionResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  });

/* ---------------------------- Ranking endpoints --------------------------- */

  app.get("/ranking/:n", async (req, res) => {
    try {
      // Forward the get ranking request to the user service
      const rankingResponse = await axios.get(
        `${rankingServiceUrl}/ranking/${req.params.n}`
      );
      res.json(rankingResponse.data);
    } catch (error) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error });
    }
  });
}