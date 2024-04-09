const questionServiceUrl = process.env.JORDI_SERVICE_URL || "http://localhost:8003";
const historyService = process.env.HISTORY_SERVICE_URL || "http://localhost:8004";

const checkFields = (fields, part) => {
  for (let field of fields) {
    if (!(field in part)) return field
  }
}

module.exports = (app, axios, errorHandler) => {
  app.post("/game/answer", (req, res) => {

    // TODO - Check save ownership
    // const { userIdToken: userId } = req

    const result = checkFields(["questionId", "last", "answer", "time", "saveId", "statement", "options"], req.body)
    if(result) return res.status(400).send({ error: `Field ${result} is required` });

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
          .then(() => res.status(200).json({answer: question.answer, points}))
          .catch((error) => errorHandler(error, res, "An error occured while fetching the categories"));
      })
      .catch((error) => errorHandler(error, res, "An error occured while fetching the answer"));
  });

  app.get("/game/categories", (_, res) => {
    axios
      .get(`${questionServiceUrl}/categories`)
      .then((response) => res.status(response.status).send(response.data))
      .catch((error) =>
        errorHandler(error, res, "An error occured while fetching the categories")
      );
  });

  // TODO - Check n is a number -> error 400
  // TODO - If no category is found -> error 404
  app.get("/game/questions/:category/:n", async (req, res) => {
      axios
        .get(`${questionServiceUrl}/questions/${req.params.category}/${req.params.n}`)
        .then((response) => {
          const questions = response.data.map(q => {
            const {answer, ...rest} = q
            return rest
          })
          res.status(response.status).send(questions)
        })
        .catch((error) =>
          errorHandler(error, res, "An error occured while fetching the questions")
        );
      
  });
};
