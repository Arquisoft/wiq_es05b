const { MongoMemoryServer } = require('mongodb-memory-server');
const testUtils = require('./testUtils.js');
const axios = require('axios');
const exec = require('child_process').exec;


let mongoserver;
let userservice;
let authservice;
let gatewayservice;
let ranking;
let jordi;
let userhistory;
async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;

    //Start webapp
    console.log('Starting react app.');
    exec('npm start', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });

    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    ranking = await require("../../ranking/ranking-service");
    jordi = await require("../../jordi/jordi-service");
    userhistory = await require("../../userhistory/history-service");

    await testUtils.insertSampleUser(axios);

}
startServer();
