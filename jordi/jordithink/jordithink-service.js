
const capitals = require("./categories/capitals");
const countries = require("./categories/countries");
const population = require("./categories/population");
const languages = require("./categories/languages");

// const cron = require('node-cron');

async function script() {
    
    try {

        const questions = await languages.generate(20);

        for (const question of questions) {
            console.log(question.statement);
            console.log("\tCategories: " + question.categories);
            console.log("\tOptions: " + question.options);
            console.log("\tAnswer: " + question.answer);
        }
        
    }

    catch (error) {

        console.error("Error:", error);
    }

}

script();

// Ejecuta el script cada hora
// cron.schedule('0 * * * *', () => {
//     console.log("Running script at : " + new Date());
//     script();
// }, {
//     scheduled: true,
//     timezone: "Europe/Madrid"
// });


