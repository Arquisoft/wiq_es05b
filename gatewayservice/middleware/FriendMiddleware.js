const axios = require('axios');

module.exports = (i18next) => async (req, res, next) => {
    const { userIdToken } = req
    let userId

    if ("userId" in req.params) userId = req.params.userId
    else if ("userId" in req.body) userId = req.body.userId
    else userId = req.query.userId

    if (!userId) return next({ status: 400, error: i18next.t("error_no_userid") })
    // If the user is trying to access its own data
    if (userIdToken && userIdToken === userId) return next() 
    
    //Check whether the requested user is a friend of the logged one
    try {
        const response = await axios
            .get(`/users/social/friends/${userIdToken}`,
            {headers: {Authorization: `Bearer ${userIdToken}`}})


        const friendIds = [];
        for (let friendship of response.data){
            friendIds.push(friendship.user1._id);
            friendIds.push(friendship.user2._id);
        }

        if (friendIds.includes(userId)) return next();
        next({ status: 403, error: i18next.t("error_no_friends") });
    } catch (error) {
        next({ status: 500, error: i18next.t("error_fetching_user") });
    }
}