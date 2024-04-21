const requestLoggerMiddleware = (logger, serviceName) => (req, res, next) => {
  res.on("finish", () => {
    logger(`[${serviceName}] SEND >>>`, {content: res.contentBody});
  });
  next();
};

module.exports = requestLoggerMiddleware;