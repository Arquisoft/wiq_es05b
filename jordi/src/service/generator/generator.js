
function script () {

        const templates = {
            capitals: 0.2,
            animals: 0.5,
            jordihurtado: 0.3,
        }
        const questions = []

        random.generate(templatequestions)
        
        Question.save(questions)

}