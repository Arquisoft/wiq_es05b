
const errorHandler = (e, res, obj) => {
    if(e.includes("ECONNREFUSED")) {
        res.status(503).json({error: "ECONNREFUSED"})
        return
    }
    res.status(500).json({error: `An error occured while fetching ${obj}`})
}

module.exports = function (app, questionsRepository) {

    app.get("/categories", async (_req, res) => {
        questionsRepository.getCategories()
            .then(result => res.json(result))
            .catch(err => errorHandler(err, res, "categories"));
    })

    app.get('/questions/:category/:n', async (req, res) => {
        const { category, n } = req.params;

        questionsRepository.getQuestions(category, n)
            .then(result => {

                // Randomize the order of questions
                result = result.sort(() => Math.random() - 0.5);

                // Return questions without answer
                const answerLessQuestions = result.map(q => {
                    const {answer, statements, ...rest} = q;
                    const statement = statements[Math.floor(Math.random() * statements.length)]
                    rest.statement = statement;
                    rest.options = rest.options.sort(() => Math.random() - 0.5);
                    return rest;
                });
                
                res.json(answerLessQuestions);
            })
            .catch(err => errorHandler(err, res, "questions"))
    });

    // TODO - Should be GET rather than POST
    app.post('/answer', async (req, res) => {
        const { id } = req.body;

        if(!id) {
            res.status(400).json({ error: "No id provided" })
            return
        }

        if(!questionsRepository.checkValidId(id)) {
            res.status(400).json({ error: "Invalid id format" })
            return
        }

        questionsRepository.findQuestionById(id)
            .then(result => {
                if(!result) {
                    res.status(404).json({ error: "Question not found" })
                    return
                }
                res.json({ answer: result.answer })
            })
            .catch(err => errorHandler(err, res, "answer"))
    });
}