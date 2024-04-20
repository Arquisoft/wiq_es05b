const winston = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format');

const logger = (file="logs/info.log", level="debug") => winston.createLogger({
  level: level,
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new winston.transports.File({
      filename: file,
      level: level
    })
  ]
})

module.exports = logger;