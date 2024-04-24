const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { loggerFactory, errorHandlerMiddleware, responseLoggerMiddleware, requestLoggerMiddleware, i18nextMiddleware, i18nextInitializer } = require("cyt-utils")
const promBundle = require('express-prom-bundle');
const i18next = require('i18next');

const WikidataQAManager = require('./WikidataGenerator');
const groups = require('./groups.json');
const generators = groups.map(group => new WikidataQAManager(group));

// Create the server
const app = express();
const port = 8003;

const logger = loggerFactory()

i18nextInitializer(i18next, {
	en: require('./locals/en.json'),
	es: require('./locals/es.json'),
})

app.set("i18next", i18next);

// Connect to the database
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questions';
mongoose.connect(mongoUri);

const generateOnStartup = process.env.GENERATE_ON_STARTUP || true;
const schedule = process.env.SCHEDULE || "* * * 1 * *";

// Initialize the repository
const questionsRepository = require('./repositories/questionRepository');
questionsRepository.init(mongoose, mongoUri);

// Middleware to analyze request bodies 
app.use(express.json());

// Middleware to log requests and responses
app.use(requestLoggerMiddleware(logger.info.bind(logger), "Jordi Service"))
app.use(responseLoggerMiddleware(logger.info.bind(logger), "Jordi Service"))

app.use(i18nextMiddleware(i18next))

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Routes
require("./routes/jordiRoutes")(app, questionsRepository);

app.use(errorHandlerMiddleware(logger.error.bind(logger), "Jordi Service"))

// Run the server
const server = app.listen(port, function () {
	console.log('Jordi listening on port ' + port);
	console.log('Press [Ctrl+C] to quit.');
});

server.on('close', () => {
	cron.getTasks().forEach(task => task.stop());
	mongoose.connection.close()
});
module.exports = server;

// Script to generate questions

async function script() {

	try {

		for (let count = 0; count < generators.length; count++) {
			const generator = generators[count];

			let questions = null;
			try {
				questions = await generateQuestions(count);
			} catch (error) {
				continue;
			}


			if (questions.length === 0)
				throw new Error("Wikidata API error: No questions generated.");

			await mongoose.connection.collection("questions").deleteMany({ groupId: generator.groupId });

			await mongoose.connection.collection("questions").insertMany(questions);

			// Output

			// for (const question of questions) {
			//     console.log(question.statement);
			// }
			// console.log("Questions generated " + questions.length);

			console.log(`MongoDB [${new Date().toLocaleString('en-GB') }]: Questions updated for group -> ${generator.groupId}`);

		}
	} catch (error) {
		console.error("Error:", error);
	}
}

async function generateQuestions(count) {
	const result = [];
	result.push(...await generators[count].generate());
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