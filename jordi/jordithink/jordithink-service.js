
// Generators
// TODO: being able to edit this in real time
const generators = [
    require("./generators/capitals"),
    require("./generators/countries"),
    require("./generators/population"),
    require("./generators/languages"),
]

let count = 0;

const mongoose = require('mongoose');
const cron = require('node-cron');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';

async function script() {
    
    try {
        await mongoose.connect(mongoUri);

        await mongoose.connection.collection('questions').deleteMany({category: generators[count].getCategory()});
        const questions = await generateQuestions();

        // Output questions
        for (const question of questions) {
            console.log(question.statement);
        }
        console.log("Questions generated" + questions.length);

        await mongoose.connection.collection('questions').insertMany(questions);
        console.log("Questions saved to MongoDB");
        await mongoose.disconnect()
    }

    catch (error) {
        console.error("Error:", error);
    }

}

// Genera las preguntas, devuelve un array e incrementa el count
async function generateQuestions() {
    const result = [];
    result.push(...await generators[count].generate());
    count = (count + 1) % generators.length;
    return result;
}

// Ejecuta el script una vez al inicio
script();

// * segundo * hora * minuto * dia * mes * año
cron.schedule('* 0 * * * *', () => {
    console.log("Running script at : " + new Date());
    script();
}, {
    scheduled: true,
    timezone: "Europe/Madrid"
});


