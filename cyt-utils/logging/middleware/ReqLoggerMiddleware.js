const resDotSendInterceptor = (res, send) => (content) => {
  res.contentBody = content;
  res.send = send;
  res.send(content);
};

const requestLoggerMiddleware = (logger, serviceName) => (req, res, next) => {
  logger(`[${serviceName}] RECV <<<`, {method: req.method, url: req.url, host: req.hostname, body: req.body});
  res.send = resDotSendInterceptor(res, res.send);
  next();
};

module.exports = requestLoggerMiddleware