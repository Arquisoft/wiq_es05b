
const capitals = require("./categories/capitals");
const countries = require("./categories/countries");
const population = require("./categories/population");
const languages = require("./categories/languages");
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';

// const cron = require('node-cron');

async function script() {
    
    try {
        await mongoose.connect(mongoUri);
        const questions = await capitals.generate(40);

        for (const question of questions) {
            console.log(question.statement);
            console.log("\tCategories: " + question.categories);
            console.log("\tOptions: " + question.options);
            console.log("\tAnswer: " + question.answer);

            // Save question to MongoDB
        }

        await mongoose.connection.collection('questions').insertMany(questions);
        console.log("Questions saved to MongoDB");
        await mongoose.disconnect()
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


