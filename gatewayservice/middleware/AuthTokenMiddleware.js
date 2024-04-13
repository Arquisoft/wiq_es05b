module.exports = (req, res, next) => {
  const { userIdToken } = req
  let userId

  if("userId" in req.params) {
    userId = req.params.userId
  } else if ("userId" in req.body) {
    userId = req.body.userId
  } else {
    userId = req.query.userId
  }

  if(!userId) return next({status: 400, error: "No userId provided"})
  if (userIdToken && userIdToken !== userId) return next({ status: 401, error: "You don't own this save" })

  next()
}