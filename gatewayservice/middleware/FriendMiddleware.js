const axios = require('axios');

module.exports = async (req, res, next) => {
    const { userIdToken } = req
    let userId

    console.log("Friend middleware")

    if ("userId" in req.params) {
        userId = req.params.userId
    } else if ("userId" in req.body) {
        userId = req.body.userId
    } else {
        userId = req.query.userId
    }

    if (!userId) return next({ status: 400, error: "No userId provided" })
    if (userIdToken && userIdToken === userId) // If the user is trying to access its own data
        next()
    else { //Check whether the requested user is a friend of the logged one
        try {

            const url = `${req.protocol}://${req.headers.host}/users/social/friends/${userIdToken}`
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    Authorization: `Bearer ${userIdToken}`
                }
            });
            console.log("Friendships retrieved:")
            console.log(response.data)

            const friendIds = [];
            for (let friendship of response.data){
                friendIds.push(friendship.user1._id);
                friendIds.push(friendship.user2._id);
            }

            if (friendIds.includes(userId))
                next();
            else
                next({ status: 403, error: "You are not friends with this user" });
        } catch (error) {
            console.log(error)
            next({ status: 500, error: "An error occurred while checking user friendships" });
        }
    }
}