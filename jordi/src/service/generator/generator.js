
const capitals = require("./categories/capitals");
const countries = require("./categories/countries");

async function script () {
    try {

        const questions = capitals.generate(20);

        for (const question of questions) {
            console.log(question.statement);
            console.log("\tCategories: "+question.categories)
            console.log("\tOptions: "+question.options);
            console.log("\tAnswer: "+question.answer);
        }

    } catch (error) {
        console.error("Error:", error);
    }

}

script();