const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { loggerFactory, errorHandlerMiddleware, responseLoggerMiddleware, requestLoggerMiddleware, i18nextMiddleware, i18nextInitializer} = require("cyt-utils")
const promBundle = require('express-prom-bundle');
const i18next = require('i18next');

// Create a logger
const logger = loggerFactory()

i18nextInitializer(i18next, {
    en: require('./locals/en.json'),
    es: require('./locals/es.json'),
})

// Creates the app
const app = express();
const port = 8004;

app.set("i18next", i18next);

// Connects to the database
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/history"
mongoose.connect(mongoUri);

// Initializes the repository
const saveRepository = require('./repositories/saveRepository');
saveRepository.init(mongoose, mongoUri, i18next);

app.use(express.json())

app.use(requestLoggerMiddleware(logger.info.bind(logger), "History Service"))
app.use(responseLoggerMiddleware(logger.info.bind(logger), "History Service"))

app.use(i18nextMiddleware(i18next))

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Routes
require('./routes/historyRoutes')(app, saveRepository);

app.use(errorHandlerMiddleware(logger.error.bind(logger), "History Service"))

const server = app.listen(port, () => console.log(`History listening on port ${port}`));

// Periodically cleans saves that have been in progress for more than 24 hours
cron.schedule('0 0 0 * * *', () => { // * second * minute * hour * date * month * year
    console.log(`[${new Date().toISOString()}] Cleaning stale unfinished saves`);
    saveRepository
    .cleanStaleSaves()
    .then(n => console.log(`[${new Date().toISOString()}] ${n} saves cleaned`))
    .catch(() => {})
}, {
    scheduled: true,
    timezone: "Europe/Madrid"
});

server.on('close', () => {
    mongoose.connection.close()
    cron.getTasks().forEach(task => task.stop())
});

module.exports = server