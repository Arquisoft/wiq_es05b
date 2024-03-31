module.exports = function (app) {
  app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
  });
};
