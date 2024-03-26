
const DEBUG = false;

const mongoose = require('mongoose');
const cron = require('node-cron');
const WikidataQAManager = require('./WikidataGenerator');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';

// Make a WikidataQAManager for each groups.json entry
const groups = require('./groups.json');
const generators = groups.map(group => new WikidataQAManager(group));

console.log(generators);

async function script() {
    
    try {

        await mongoose.connect(mongoUri);

        for (let count = 0; count < generators.length; count++) {
            
            // Get the generator name for later logging
            const element = generators[count];
    
            // Generate questions
            const questions = await generateQuestions(count);

            // If questions could not be generated, skip
            if (questions.length == 0)
                throw new Error("Wikidata API error: No questions generated.");
            
            // Delete all questions for the generated category
            await mongoose.connection.collection("questions").deleteMany({ groupId: element.groupId });
            
            // Insert the new questions
            await mongoose.connection.collection("questions").insertMany(questions);
            
            // Output success message
            if (DEBUG) outputQuestions(questions);
            console.log(`MongoDB: Questions updated for group -> ${element.groupId}`);

        }
        await mongoose.disconnect()
    }
    catch (error) {
        console.error("Error:", error);
    }

}

// Output the questions to the console
function outputQuestions(questions) {
    for (const question of questions) {
        console.log(question.statement);
    }
    console.log("Questions generated " + questions.length);
}

// Generate the questions, return an array and increment the count
async function generateQuestions(count) {
    const result = [];
    result.push(...await generators[count].generate());
    return result;
}

// Run script on start
script();


// Schedule the script
cron.schedule('* * * 1 * *', () => { // * second * minute * hour * date * month * year
    console.log("Running script at : " + new Date());
    script();
}, {
    scheduled: true,
    timezone: "Europe/Madrid"
});


