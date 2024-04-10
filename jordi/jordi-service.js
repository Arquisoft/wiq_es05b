
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const WikidataQAManager = require('./WikidataGenerator');
const groups = require('./groups.json');
const generators = groups.map(group => new WikidataQAManager(group));

const app = express();
const port = 8003;

const questionsRepository = require('./repositories/questionRepository');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';
const generateOnStartup = process.env.GENERATE_ON_STARTUP || true;
const schedule = process.env.SCHEDULE || "* * * 1 * *";

mongoose.connect(mongoUri);

questionsRepository.init(mongoose, mongoUri);

// Middleware to analyze request bodies 
app.use(express.json());

require("./routes/routes")(app, questionsRepository);

// Run the server
const server = app.listen(port, function () {
    console.log('Jordi listening on port ' + port);
    console.log('Press [Ctrl+C] to quit.');
});

async function script() {
    
    try {

        await mongoose.connect(mongoUri);

        console.log("\nMongoDB: Generating Questions...")

        for (let count = 0; count < generators.length; count++) {
            
            const generator = generators[count];
            const questions = await generateQuestions(count);

            if (questions.length == 0)
                throw new Error("Wikidata API error: No questions generated.");
            
            await mongoose.connection.collection("questions").deleteMany({ groupId: generator.groupId });

            await mongoose.connection.collection("questions").insertMany(questions);
            
            // Output
            
            // for (const question of questions) {
            //     console.log(question.statement);
            // }
            // console.log("Questions generated " + questions.length);

            console.log(`MongoDB: Questions updated for group -> ${generator.groupId}`);

        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

async function generateQuestions(count) {
    const result = [];
    result.push( ... await generators[count].generate());
    return result;
}

if (generateOnStartup)
    script();

// * second * minute * hour * date * month * year
cron.schedule(schedule, () => {
    console.log("Running script at : " + new Date());
    script();

}, {
    scheduled: true,
    timezone: "Europe/Madrid"
});


server.on('close', () => mongoose.connection.close());