
// TODO - move to npm package
const checkFieldsOn = (fields, obj) => {
  for (let field of fields)
    if (!(field in obj)) return field;
  return null;
}

module.exports = (app, saveRepository) => {
  const i18next = app.get("i18next");

  app.post("/create", (req, res, next) => {
    const result = checkFieldsOn(["userId", "category"], req.body)
    if(result) return next({status: 400, error: `${i18next.t("error_missing_field")} ${result}`})

    const { userId, category } = req.body;

    if (category.trim().length === 0) return next({ status: 400, error: i18next.t("error_empty_category")})
    if (!saveRepository.isValidObjectId(userId)) return next({ status: 400, error: i18next.t("error_invalid_userId") });

    saveRepository
      .createSave(userId, category)
      .then(result => res.status(201).json(result))
      .catch(error => next(error))
  })

  // TODO - Gateway should check if the user is owner of the save
  app.post("/add/:id", (req, res, next) => {
    const { id } = req.params;
    if (!saveRepository.isValidObjectId(id)) return next({ status: 400, error: i18next.t("error_invalid_Id")})

    const result = checkFieldsOn(["last", "statement", "options", "answer", "correct", "time", "points", "isHot"], req.body)
    if(result) return next({status: 400, error: `${i18next.t("error_missing_field")} ${result}`})

    const { last, statement, options, answer, correct, time, points, isHot } = req.body;

    const question = { statement, options, answer, correct, time, points, isHot };

    saveRepository
      .addAnswer(question, id, last)
      .then((result) => {
        if (result.message.includes(i18next.t("error_save_not_found"))) return next({ status: 404, error: result.message})
        if (result.message.includes(i18next.t("error_save_finished"))) return next({ status: 400, error: result.message})

        res.json({ message: i18next.t("question_added") });
      })
      .catch((e) => next(e));
  });

  app.get("/get/:userId", (req, res, next) => {
    const { userId } = req.params;
    if (!saveRepository.isValidObjectId(userId)) return next({ status: 400, error: i18next.t("error_invalid_userId")})
    let { page, limit } = req.query;

    if (!("page" in req.query) || !("limit" in req.query) || isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
      page = -1;
      limit = -1;
    }

    saveRepository
      .getUserSaves(userId, page, limit)
      .then((result) => res.json(result))
      .catch((e) => next(e));
  });

  app.get("/get/:userId/:id", (req, res, next) => {
    const { userId, id } = req.params;
    if (!saveRepository.isValidObjectId(userId)) return next({status: 400, error: i18next.t("error_invalid_userId")})
    if (!saveRepository.isValidObjectId(id)) return next({status: 400, error: i18next.t("error_invalid_Id")})

    saveRepository
      .getUserSave(userId, id)
      .then((result) => {
        if (!result) return next({status: 404, error: i18next.t("error_save_not_found")})

        res.json(result);
      })
      .catch((e) => next(e));
  });

  // Get top n ranking
  app.get("/ranking/:n", async (req, res, next) => {
    const { n } = req.params;
    let { order } = req.query;

    if (["totalPoints", "totalTime", "date", "category", "correct"].indexOf(order) === -1)
      order = "totalPoints";

    if (isNaN(n)) return next({status: 400, error: i18next.t("error_invalid_n")})

    saveRepository
      .getRanking(Number(n), order)
      .then((result) => res.json(result))
      .catch((error) => next(error));
  });
};
