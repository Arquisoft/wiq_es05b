const errorHandler = (e, res, obj) => {
  let code = 500
  let msg = `An error occured while fetching ${obj || "data"}`
  if (e.includes("ECONNREFUSED")) {
    code = 503
    msg = "Service Unavailable"
  }
  res.status(code).json({error: msg})
}

module.exports = function (app, questionsRepository) {

  app.get("/categories", async (_req, res) => {
    questionsRepository.getCategories()
      .then(result => res.json(result))
      .catch(err => errorHandler(err, res, "categories"));
  })
  app.get("/question/:id", (req, res) => {
    if(!questionsRepository.checkValidId(req.params.id)) return res.status(400).json({error: "Invalid id format"})
      questionsRepository
        .findQuestionById(req.params.id)
        .then(result => res.json(result))
        .catch(err => errorHandler(err, res, "question"));
  })

  // TODO - Should return 404 if category not found
  // TODO - Check n is a number -> error 400
  app.get('/questions/:category/:n', async (req, res) => {
    const {category, n} = req.params;

    questionsRepository.getQuestions(category, n)
      .then(result => {

        // Randomize the order of questions
        result = result.sort(() => Math.random() - 0.5);

        // Return questions without answer
        const answerLessQuestions = result.map(q => {
          const {statements, ...rest} = q;
          rest.statement = statements[Math.floor(Math.random() * statements.length)]
          rest.options = rest.options.sort(() => Math.random() - 0.5);
          return rest;
        });

        res.json(answerLessQuestions);
      })
      .catch(err => errorHandler(err, res, "questions"))
  });
}