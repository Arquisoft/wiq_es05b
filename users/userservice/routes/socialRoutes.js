module.exports = function (app, userRepository, socialRepository) {

    app.post("/social/sendrequest", async (req, res, next) => {
        console.log("llega a sendrequest")
        console.log(req.body)
        try {
            const { name,userId, toId } = req.body;
            const result = await socialRepository.insertRequest(name,userId, toId);
            res.json(result);
        } catch (error) {
            console.log(error)
            next({ error: error });
        }
    });

    app.get("/social/sentrequests/:userId", async (req, res, next) => {
        const { userId } = req.params;

        try {
            const result = await socialRepository.getSentRequests(userId);
            res.json(result);
        } catch (error) {
            next({ error: error });
        }
    });

    app.get("/social/receivedrequests/:userId", async (req, res, next) => {
        const { userId } = req.params;

        try {
            const result = await socialRepository.getReceivedRequests(userId);
            res.json(result);
        } catch (error) {
            next({ error: error });
        }
    });

}