const checkFieldsOn = (fields, obj) => {
  for (let field of fields)
    if (!obj[field]) return field;
  return null;
}

module.exports = (app, saveRepository) => {
  // TODO - Add error mapping
  app.post("/create", (req, res, next) => {
    const result = checkFieldsOn(["userId", "category"], req.body)
    if(result) return next({status: 400, error: `Missing ${result}`})

    const { userId, category } = req.body;

    if (category.trim().length === 0) return next({ status: 400, error: "Category cannot be empty"})
    if (!saveRepository.isValidObjectId(userId)) return next({ status: 400, error: "Invalid userId format" });

    saveRepository
      .createSave(userId, category)
      .then(result => res.status(201).json(result))
      .catch(error => next(error))
  })

  // TODO - Add error mapping
  // TODO - Gateway should check if the user is owner of the save
  app.post("/add/:id", (req, res, next) => {
    const result = checkFieldsOn(["last", "statement", "options", "answer", "correct", "time", "points"], req.body)
    if(result) return next({status: 400, error: `Missing ${result}`})

    const { id } = req.params;
    const { last, statement, options, answer, correct, time, points } = req.body;

    if (!saveRepository.isValidObjectId(id)) return next({ status: 400, error: "Invalid id format"})

    const question = { statement, options, answer, correct, time, points };

    saveRepository
      .addAnswer(question, id, last)
      .then((result) => {
        if (result.message.includes("Save not found")) return next({ status: 404, error: result.message})
        if (result.message.includes("Save is already finished")) return next({ status: 400, error: result.message})

        res.json({ message: "Question added successfully" });
      })
      .catch((e) => next(e));
  });

  // TODO - Add error mapping
  app.get("/get/:userId", (req, res, next) => {
    const { userId } = req.params;
    if (!saveRepository.isValidObjectId(userId)) return next({ status: 400, error: "Invalid userId format"})
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

  // TODO - Add error mapping
  app.get("/get/:userId/:id", (req, res, next) => {
    const { userId, id } = req.params;
    if (!saveRepository.isValidObjectId(userId)) return next({status: 400, error: "Invalid userId format"})
    if (!saveRepository.isValidObjectId(id)) return next({status: 400, error: "Invalid id format"})

    saveRepository
      .getUserSave(userId, id)
      .then((result) => {
        if (!result) return next({status: 404, error: "Save not found"})

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

    if (isNaN(n)) return next({status: 400, error: "Invalid value for n"})

    saveRepository
      .getRanking(Number(n), order)
      .then((result) => res.status(200).json(result))
      .catch((error) => next(error));
  });
};
