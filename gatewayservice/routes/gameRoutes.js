let express = require("express");
let router = express.Router();
let axios = require('axios');

const questionServiceUrl = process.env.JORDI_ASK_SERVICE_URL || 'http://localhost:8003';

router.post("/uploadresult", (req, res) => { });

router.get("/:id", (req, res) => { });

router.post("/answer", async (req, res) => {

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
