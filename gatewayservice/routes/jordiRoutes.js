const { fieldChecker } = require("cyt-utils")
const questionServiceUrl = process.env.JORDI_SERVICE_URL || "http://localhost:8003";
const historyService = process.env.HISTORY_SERVICE_URL || "http://localhost:8004";

const errorParser = (e, next) => {
  if(e.code && e.code === "ECONNREFUSED") return next(e.code)
  next({status: e.response.status, error: e.response.data})
}

module.exports = (app, axios) => {

  const i18next = app.get("i18next")

  app.post("/game/answer", (req, res, next) => {
    let { isHot } = req.query

    if(!("isHot" in req.query)) isHot = false
    isHot = (isHot === "true")

    // TODO - Check save ownership
    // const { userIdToken: userId } = req

    const result = fieldChecker(["questionId", "last", "answer", "time", "saveId", "statement", "options"], req.body)
    if(result) return next({status: 400, error: `${i18next.t("error_missing_field")} ${result}`})

    const { questionId, last, answer, time, saveId, statement, options } = req.body

    axios
      .get(`${questionServiceUrl}/question/${questionId}`)
      .then(response => {
        const question = response.data

        let points = -10
        if(answer === null) points = 0
        else if(answer === question.answer) points = 100

        if(isHot) points *= 2

        const iAnswer = options.indexOf(answer)
        const iCorrect = options.indexOf(question.answer)

        axios
          .post(`${historyService}/add/${saveId}`,
            {last, statement, options, answer: iAnswer, correct: iCorrect, time, points, isHot})
          .then(() => res.json({answer: question.answer, points}))
          .catch(() => res.json({answer: question.answer, points, error: i18next.t("error_adding_answer")}));
      })
      .catch(e => errorParser(e, next));
  });

  app.get("/game/categories", (_req, res, next) => {
    axios
      .get(`${questionServiceUrl}/categories`)
      .then((response) => res.status(response.status).send(response.data))
      .catch(e => errorParser(e, next));
  });

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
        .catch(e => errorParser(e, next));
  });

  // ADMIN ROUTES ONLY
  app.get("/admin/gen/:groupId", async (req, res, next) => {

    axios.get(`${questionServiceUrl}/gen/${req.params.groupId}`)
      .then(response => res.status(response.status).send(response.data))
      .catch(e => errorParser(e, next));

  });

  app.get("/admin/gen", async (req, res, next) => {
    
    axios.get(`${questionServiceUrl}/gen`)
      .then(response => res.status(response.status).send(response.data))
      .catch(e => errorParser(e, next));

  });

  app.get("/admin/groups", async (req, res, next) => {
    
    axios.get(`${questionServiceUrl}/groups`)
      .then(response => res.status(response.status).send(response.data))
      .catch(e => errorParser(e, next));

  });

  app.post("/admin/addGroups", async (req, res, next) => {
    
    axios.post(`${questionServiceUrl}/addGroups`, req.body)
      .then(response => res.status(response.status).send(response.data))
      .catch(e => errorParser(e, next));

  });

  app.get("/admin/removeGroup/:groupId", async (req, res, next) => {
    
    axios.get(`${questionServiceUrl}/removeGroup/${req.params.groupId}`)
      .then(response => res.status(response.status).send(response.data))
      .catch(e => errorParser(e, next));
  });

  app.get("/admin/removeAllGroups", async (req, res, next) => {
    
    axios.get(`${questionServiceUrl}/removeAllGroups`)
      .then(response => res.status(response.status).send(response.data))
      .catch(e => errorParser(e, next));

  });

};
