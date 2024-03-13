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

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    };

    const response = await fetch(`${questionServiceUrl}/answer`, requestOptions);
    const result = await response.json();

    res.send(result);

});

module.exports = router;
