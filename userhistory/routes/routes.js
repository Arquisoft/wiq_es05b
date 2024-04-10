module.exports = (app, saveRepository) => {
  // TODO - Add error mapping
  app.post("/create", (req, res) => {
    const { userId, category } = req.body;

    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }
    if (!category) {
      res.status(400).json({ error: "Missing category" });
      return;
    }
    if (category.trim().length === 0) {
      res.status(400).json({ error: "Category cannot be empty" });
      return;
    }
    if (!saveRepository.isValidObjectId(userId)) {
      res.status(400).json({ error: "Invalid userId format" });
      return;
    }

    saveRepository
      .createSave(userId, category)
      .then(result => res.status(201).json(result))
      .catch(error => res.status(500).json(error))
  })

  // TODO - Add error mapping
  // TODO - Gateway should check if the user is owner of the save
  app.post("/add/:id", (req, res) => {
    const { id } = req.params;
    const { last, statement, options, answer, correct, time, points } =
      req.body;

    if (!("last" in req.body)) {
      res.status(400).json({ error: "Missing last" });
      return;
    }
    if (!statement) {
      res.status(400).json({ error: "Missing statement" });
      return;
    }
    if (!options) {
      res.status(400).json({ error: "Missing options" });
      return;
    }
    if (!("answer" in req.body)) {
      res.status(400).json({ error: "Missing answer" });
      return;
    }
    if (!("correct" in req.body)) {
      res.status(400).json({ error: "Missing correct" });
      return;
    }
    if (!("time" in req.body)) {
      res.status(400).json({ error: "Missing time" });
      return;
    }
    if (!("points" in req.body)) {
      res.status(400).json({ error: "Missing points" });
      return;
    }
    if (!saveRepository.isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid id format" });
      return;
    }

    const question = {
      statement,
      options,
      answer,
      correct,
      time,
      points,
    };

    saveRepository
      .addAnswer(question, id, last)
      .then((result) => {
        if (result.message.includes("Save not found")) {
          res.status(404).json({ error: result.message });
          return;
        }
        if (result.message.includes("Save is already finished")) {
          res.status(400).json({ error: result.message });
          return;
        }

        res.json({ message: "Question added successfully" });
      })
      .catch((e) => res.status(500).json(e));
  });

  // TODO - Add error mapping
  app.get("/get/:userId/", (req, res) => {
    const { userId } = req.params;
    if (!saveRepository.isValidObjectId(userId)) {
      res.status(400).json({ error: "Invalid userId format" });
      return;
    }
    let { page, limit } = req.query;

    if (
      !"page" in req.query ||
      !"limit" in req.query ||
      isNaN(parseInt(page)) ||
      isNaN(parseInt(limit))
    ) {
      page = -1;
      limit = -1;
    }

    saveRepository
      .getUserSaves(userId, page, limit)
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  });

  // TODO - Add error mapping
  app.get("/get/:userId/:id", (req, res) => {
    const { userId, id } = req.params;
    if (!saveRepository.isValidObjectId(userId)) {
      res.status(400).json({ error: "Invalid userId format" });
      return;
    }
    if (!saveRepository.isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid id format" });
      return;
    }

    saveRepository
      .getUserSave(userId, id)
      .then((result) => {
        if (!result) {
          res.status(404).json({ error: "Save not found" });
          return;
        }

        res.json(result);
      })
      .catch((e) => res.status(500).json(e));
  });

  // Get top n ranking
  app.get("/ranking/:n", async (req, res) => {
    const { n } = req.params;
    let { order } = req.query;

    if (["totalPoints", "totalTime", "date", "category", "correct"].indexOf(order) === -1)
      order = "totalPoints";

    if (isNaN(n)) {
      return res.status(400).json({ error: "Invalid value for n" });
    }

    saveRepository
      .getRanking(Number(n), order)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  });
};
