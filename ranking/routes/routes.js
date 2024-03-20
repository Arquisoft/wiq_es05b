module.exports = function (app, rankingRepository) {

    // get top n ranking
    app.get("/ranking/:n", async (req, res) => {
        const {n} = req.params;

        rankingRepository.getRanking(n)
            .then(result => res.json(result))
            .catch(error => res.status(500).json({error: error}));
    });

    // add record
    app.post("/adduser", async (req, res) => {
        const {name, points} = req.body;
        if (!name || !points) {
            return res.status(400).json({error: "Name and points are required"});
        }
        rankingRepository.insertRecord(name, points)
            .then(result => res.json(result))
            .catch(error => res.status(500).json({error: error}));
    });
}