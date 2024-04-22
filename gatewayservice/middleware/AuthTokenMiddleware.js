module.exports = (i18next) => (req, res, next) => {
  const { userIdToken } = req
  let userId

  if("userId" in req.params) {
    userId = req.params.userId
  } else if ("userId" in req.body) {
    userId = req.body.userId
  } else {
    userId = req.query.userId
  }

  if(!userId) return next({status: 400, error: `${i18next.t("error_missing_field")} userId`})
  if (userIdToken && userIdToken !== userId) return next({ status: 401, error: i18next.t("error_save_property") })

  next()
}