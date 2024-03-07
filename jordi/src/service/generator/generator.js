
const capitals = require("./templates/capitals");
const countries = require("./templates/countries");

async function script () {
    try {
        const questions = await capitals.generate(20);

        for (const question of questions) {
            console.log(question.statement);
            console.log(question.options);
            console.log(question.answer);
        }
    } catch (error) {
        console.error("Error:", error);
    }

}

script();