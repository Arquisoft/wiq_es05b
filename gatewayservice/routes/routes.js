let express = require("express");
let router = express.Router();
let axios = require('axios');

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionServiceUrl = process.env.JORDI_ASK_SERVICE_URL || 'http://localhost:8003';
const rankingServiceUrl = process.env.RANKING_SERVICE_URL || 'http://localhost:8005';

router.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

/* ----------------------------- Users Endpoints ---------------------------- */

router.post("/login", async (req, res) => {
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

router.post("/adduser", async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(`${userServiceUrl}/adduser`,req.body);
    res.json(userResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

/* ----------------------- Question related endpoints ----------------------- */

router.get("/categories", async (req, res) => {
  try {
    // Forward the get questions request to the user service
    const questionResponse = await axios.get(
      `${questionServiceUrl}/categories`
    );
    res.json(questionResponse.data);
  } catch (error) {
    console.log(error);
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

router.get("/questions/:category", async (req, res) => {
  try {
    // Forward the get questions request to the user service
    const questionResponse = await axios.get(
      `${questionServiceUrl}/questions/${req.params.category}`
    );
    res.json(questionResponse.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.error });
  }
});

/* ---------------------------- Ranking endpoints --------------------------- */

router.get("/ranking/:n", async (req, res) => {
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

module.exports = router;
