module.exports = function (app) {
  app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
  });
  app.get("/", (_, res) => res.status(418).json({ message: "¯\_(ツ)_/¯" }))
};
