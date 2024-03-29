const errorHandler = (e, res, msg) => {
  let error = { error: msg || "Service unavailable" };
  let code = 500;
  if (e.response) {
    code = e.response.status;
    error = e.response.data;
  }
  if (e.code && e.code.includes("ECONNREFUSED")) {
    code = 503;
    error = { error: "Service unavailable" };
  }
  res.status(code).json(error);
};

module.exports = errorHandler;
