const errorHandlerMiddleware = (logger) => (err, req, res, _) => {
  logger("[Gateway Jordi] ERROR >>>", { error: err });

  let code = err.status || 500;
  let error = err.error || "Internal Server Error";

  if(typeof err === "string" && err.includes("ECONNREFUSED")) {
    code = 503;
    error = "Service Unavailable";
  }

  res.status(code).json({ error: error });
}

module.exports = errorHandlerMiddleware;