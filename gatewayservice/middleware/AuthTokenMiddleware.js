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

  if(!userId) {
    res.status(400).json({error: "No userId provided"})
    return
  }
  if (userIdToken && userIdToken !== userId) {
    res.status(401).json({ error: "You don't own this save" })
    return
  }

  next()
}