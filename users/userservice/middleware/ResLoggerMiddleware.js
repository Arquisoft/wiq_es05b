const requestLoggerMiddleware = (logger) => (req, res, next) => {
  res.on("finish", () => {
    logger("[Users Service] SEND >>>", {content: res.contentBody});
  });
  next();
};

module.exports = requestLoggerMiddleware;