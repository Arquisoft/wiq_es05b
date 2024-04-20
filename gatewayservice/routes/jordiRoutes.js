const checkFields = require("../utils/FieldChecker")
const questionServiceUrl = process.env.JORDI_SERVICE_URL || "http://localhost:8003";
const historyService = process.env.HISTORY_SERVICE_URL || "http://localhost:8004";

module.exports = (app, axios) => {
  app.post("/game/answer", (req, res, next) => {

    // TODO - Check save ownership
    // const { userIdToken: userId } = req

    const result = checkFields(["questionId", "last", "answer", "time", "saveId", "statement", "options"], req.body)
    if(result) return next({status: 400, error: `Field ${result} is required`})

    const { questionId, last, answer, time, saveId, statement, options } = req.body

    axios
      .get(`${questionServiceUrl}/question/${questionId}`)
      .then(response => {
        const question = response.data

        let points = -10
        if(answer === null) points = 0
        else if(answer === question.answer) points = 100

        const iAnswer = options.indexOf(answer)
        const iCorrect = options.indexOf(question.answer)

        axios
          .post(`${historyService}/add/${saveId}`,
            {last, statement, options, answer: iAnswer, correct: iCorrect, time, points})
          .then(() => res.json({answer: question.answer, points}))
          .catch(() => res.json({answer: question.answer, points, error: "An error occured while saving the answer"}));
      })
      .catch(() => next({error: "An error occured while fetching the answer"}));
  });

  app.get("/game/categories", (_req, res, next) => {
    axios
      .get(`${questionServiceUrl}/categories`)
      .then((response) => res.status(response.status).send(response.data))
      .catch(() => next({error: "An error occured while fetching the categories"})
      );
  });

  // TODO - Check n is a number -> error 400
  // TODO - If no category is found -> error 404
  app.get("/game/questions/:category/:n", async (req, res, next) => {
      axios
        .get(`${questionServiceUrl}/questions/${req.params.category}/${req.params.n}`)
        .then((response) => {
          const questions = response.data.map(q => {
            const {answer, ...rest} = q
            return rest
          })
          res.status(response.status).send(questions)
        })
        .catch(() => next({ error: "An error occured while fetching the questions"}));
  });
};
