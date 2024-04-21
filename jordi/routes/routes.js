module.exports = function (app, questionsRepository) {

  app.get("/categories", async (_req, res, next) => {
    questionsRepository.getCategories()
      .then(result => res.json(result))
      .catch(err => next(err));
  })

  app.get("/question/:id", (req, res, next) => {
    if(!questionsRepository.checkValidId(req.params.id)) return next({status: 400, error: "Invalid id format"})

    questionsRepository
      .findQuestionById(req.params.id)
      .then(result => res.json(result))
      .catch(err => next(err));
  })

  // TODO - Should return 404 if category not found
  // TODO - Check n is a number -> error 400
  app.get('/questions/:category/:n', async (req, res, next) => {
    const {category, n} = req.params;

    if(isNaN(n)) return next({status: 400, error: "N must be a number"})

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
      .catch(err => next(err))
  });
}