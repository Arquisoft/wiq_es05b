const questionsCache = require("../questionCache");

module.exports = function (app, questionsRepository) {

  const i18next = app.get("i18next")

  app.get("/categories", async (_req, res, next) => {
    questionsRepository.getCategories()
      .then(result => res.json(result))
      .catch(err => next(err));
  })

  app.get("/question/:id", (req, res, next) => {
    if(!questionsRepository.checkValidId(req.params.id)) return next({status: 400, error: i18next.t("error_invalid_id")})
    
    questionsRepository
      .findQuestionById(req.params.id)
      .then(result => {
        if(!result) return next({status: 404, error: i18next.t("error_question_not_found")})
        res.json(result)
      })
      .catch(err => next(err));
  })

  app.get('/questions/:category/:n', async (req, res, next) => {
    const {category, n} = req.params;

    if(isNaN(n)) return next({status: 400, error: i18next.t("error_invalid_n")})
    const c = await questionsRepository.checkCategory(category);
    if(!c) return next({status: 404, error: i18next.t("error_category_not_found")})

    questionsRepository.getQuestions(category, n)
      .then(result => {
        // Randomize the order of questions
        result = result.sort(() => Math.random() - 0.5);

        //Cache answers to prevent db access when answering
        result.forEach(q => questionsCache.storeQuestion(q));

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