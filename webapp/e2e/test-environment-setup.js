const { MongoMemoryServer } = require('mongodb-memory-server');
const testUtils = require('./testUtils.js');
const axios = require('axios');


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
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    jordi = await require("../../jordi/jordi-service");
    userhistory = await require("../../userhistory/history-service");

    await testUtils.insertSampleUser(axios);

}
startServer().then(e=>{});
