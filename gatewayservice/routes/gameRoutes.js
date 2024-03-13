let express = require("express");
let router = express.Router();
let axios = require('axios');
let authMiddleware = require('../middleware/authMiddleware');

const questionServiceUrl = process.env.JORDI_ASK_SERVICE_URL || 'http://localhost:8003';

router.post("/uploadresult", authMiddleware, (req, res) => { });

router.get("/:id", (req, res) => { });

router.post("/answer", authMiddleware, async (req, res) => {

    const params = {
        id: req.body.id,
        answer: req.body.answer
    }

    const response = await axios.post(`${questionServiceUrl}/answer`, params);

    res.send(response.data);

});

module.exports = router;
