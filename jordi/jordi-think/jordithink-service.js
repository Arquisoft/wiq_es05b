
// Generators
// TODO: being able to edit this in real time
const generators = [
    require("./generators/capitals"),
    require("./generators/countries"),
    require("./generators/population"),
    require("./generators/languages"),
]

const mongoose = require('mongoose');
const cron = require('node-cron');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';

async function script() {
    
    try {
        await mongoose.connect(mongoUri);
        for (let count = 0; count < generators.length; count++) {
            const element = generators[count];
    
            await mongoose.connection.collection('questions').deleteMany({category: element.getCategory()});
            const questions = await generateQuestions(count);
    
            // Output questions
            // for (const question of questions) {
            //     console.log(question.statement);
            // }
            // console.log("Questions generated" + questions.length);
    
            await mongoose.connection.collection('questions').insertMany(questions);
            console.log(`MongoDB: Questions updated for category -> ${element.getCategory()}`);
        }
        await mongoose.disconnect()
    }
    catch (error) {
        console.error("Error:", error);
    }

}

// Genera las preguntas, devuelve un array e incrementa el count
async function generateQuestions(count) {
    const result = [];
    result.push(...await generators[count].generate());
    return result;
}

// Ejecuta el script una vez al inicio
script();

// * segundo * minuto * hora * dia * mes * año
cron.schedule('* * * * 1 *', () => {
    console.log("Running script at : " + new Date());
    script();
}, {
    scheduled: true,
    timezone: "Europe/Madrid"
});


