const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const winston = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format');

// Create a logger
const logger = winston.createLogger({
    level: 'debug',
    format: ecsFormat({ convertReqRes: true }),
    transports: [
        new winston.transports.File({
            filename: 'logs/info.log',
            level: 'debug'
        })
    ]
})

// Creates the app
const app = express();
const port = 8004;

// Connects to the database
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/history"
mongoose.connect(mongoUri);

// Initializes the repository
const saveRepository = require('./repositories/saveRepository');
saveRepository.init(mongoose, mongoUri);

app.use(express.json())

app.use(require("./middleware/ReqLoggerMiddleware")(logger.info.bind(logger)))
app.use(require("./middleware/ResLoggerMiddleware")(logger.info.bind(logger)))

// Routes
require('./routes/routes')(app, saveRepository);

app.use(require("./middleware/ErrorHandlerMiddleware")(logger.error.bind(logger)))

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