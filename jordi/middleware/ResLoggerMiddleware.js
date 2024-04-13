const requestLoggerMiddleware = (logger) => (req, res, next) => {
  res.on("finish", () => {
    logger("[Jordi Service] SEND >>>", {content: res.contentBody});
  });
  next();
};

module.exports = requestLoggerMiddleware;