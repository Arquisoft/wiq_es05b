
const capitals = require("./templates/Capitals");

async function script () {
    
    try {
        const questions = await capitals.generate(20);

        for (const question of questions) {
            console.log(question.statement);
            console.log(question.options);
        }
    } catch (error) {
        console.error("Error:", error);
    }

}

script();