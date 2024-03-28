module.exports = function (app, questionsRepository) {

    app.get("/categories", async (_req, res) => {
        questionsRepository.getCategories()
            .then(result => res.json(result))
            .catch(err => res.status(500).json({error: err}));
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
                    return rest;
                });
                
                res.json(answerLessQuestions);
            })
            .catch(err => res.status(500).json({error: err}))
    });

    app.post('/answer', async (req, res) => {
        const { id } = req.body;

        if(!id) {
            res.status(400).json({ error: "No id provided" })
            return
        }

        questionsRepository.findQuestionById(id)
            .then(result => res.json({ answer: result.answer }))
            .catch(err => res.status(500).json({error: err}))
    });
}