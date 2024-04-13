const requestLoggerMiddleware = (logger) => (req, res, next) => {
  res.on("finish", () => {
    logger("[Gateway Service] SEND >>>", {content: res.contentBody});
  });
  next();
};

module.exports = requestLoggerMiddleware;