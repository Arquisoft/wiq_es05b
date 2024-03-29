const errorHandler = (e, res, msg) => {
    let code = 500
    let error = msg || 'Internal Server Error'
    switch (e) {
        case "ECONNREFUSED":
            code = 503
            error = "Service Unavailable"    
            break;
        case "42P01":
            error = "Table not found"
            break
        case "22P02":
            code = 400
            error = "Invalid points format, should be a number (int)"
            break
    }
    res.status(code).json({error: error})
}

module.exports = function (app, rankingRepository) {

    // get top n ranking
    // TODO - Check n is a number -> error 400
    app.get("/ranking/:n", async (req, res) => {
        const {n} = req.params;

        rankingRepository.getRanking(n)
            .then(result => res.json(result))
            .catch(error => errorHandler(error, res, "An error occured while fetching ranking"));
    });

    // add record
    app.post("/adduser", async (req, res) => {
        const {name, points} = req.body;
        if (!name) {
            return res.status(400).json({error: "Missing name"});
        }
        if (!points) {
            return res.status(400).json({error: "Missing points"});
        }
        rankingRepository.insertRecord(name, points)
            .then(() => res.json({messge: "Record added"}))
            .catch(error => errorHandler(error, res, "An error occured while adding record"));
    });
}