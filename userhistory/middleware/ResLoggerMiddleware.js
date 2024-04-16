const requestLoggerMiddleware = (logger) => (req, res, next) => {
  res.on("finish", () => {
    logger("[History Service] SEND >>>", {content: res.contentBody});
  });
  next();
};

module.exports = requestLoggerMiddleware;