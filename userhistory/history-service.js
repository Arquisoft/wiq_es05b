const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const app = express();
const port = 8004;

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/history"

const saveRepository = require('./repositories/saveRepository');
mongoose.connect(mongoUri);

saveRepository.init(mongoose, mongoUri);

app.use(express.json())

require('./routes/routes')(app, saveRepository);

const server = app.listen(port, () => {
    console.log(`History listening on port ${port}`);
});

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