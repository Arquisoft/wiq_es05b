module.exports = function (app, userRepository, socialRepository) {

    app.post("/social/sendrequest", async (req, res, next) => {
        console.log("llega a sendrequest")
        console.log(req.body)
        try {
            const { name, userId, toId } = req.body;
            const result = await socialRepository.insertRequest(name, userId, toId);
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

    app.get("/social/acceptrequest/:fromId/:toId", async (req, res, next) => {
        const { fromId, toId } = req.params
        console.log('hola2')

        try {
            await socialRepository.deleteRequest(fromId, toId);
            const result = await socialRepository.insertFriendship(fromId, toId);
            res.json(result);
        } catch (error) {
            next({ error: error });
        }
    });

    app.get("/social/friends/:userId", async (req, res, next) => {
        const { userId } = req.params;

        try {
            const result = await socialRepository.getFriendships(userId);

            if(!result || result.length === 0) {
                res.json([]);
            }
            

            const friendships = [];
            for (let friendship of result)
                friendships.push({
                    user1: await userRepository.getUser({_id: friendship.users[0]}),
                    user2: await userRepository.getUser({_id: friendship.users[1]})
            });

            for(let friendship of friendships) {
                delete friendship.user1.password;
                delete friendship.user2.password;
            }

            res.json(friendships);
        } catch (error) {
            next({ error: error });
        }
    });

}