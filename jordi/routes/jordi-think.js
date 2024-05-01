const WikidataGenerator = require("../WikidataGenerator");
const script = require("../scripts/script")

module.exports = function (app, questionsRepository, groupsRepository) {

  const i18next = app.get("i18next");

  app.get("/gen/:groupId", async (req, res, next) => {

    try {
      const { groupId } = req.params;
      let group = await groupsRepository.findGroups({ groupId: groupId });
      if (!group[0]) return next({ status: 404, error: i18next.t("error_group_not_found") });

      group = group[0];
      const generator = new WikidataGenerator(group);
      const questions = await generator.generate()

      await questionsRepository.deleteQuestions(groupId)
      await questionsRepository.insertQuestions(questions)
      res.json({ message: i18next.t("group_questions_generated") + groupId });
      console.log("Questions generated successfully: " + groupId)
    } catch (error) { next(error); }

  });

  app.get("/gen", async (req, res, next) => {
    try {
      await script(groupsRepository, questionsRepository, WikidataGenerator);
      res.json({ message: i18next.t("all_questions_generated") });
    } catch (error) { next(error); }
  });

  app.get("/groups", async (req, res, next) => {
    try {
      const groups = await groupsRepository.findGroups({});
      res.json(groups);
    } catch (error) { next(error); }
  });

  app.post("/addGroups", async (req, res, next) => {
    try {
      const groups = req.body;

      for (let group of groups)
        await groupsRepository.insertGroup(group);

      res.json({ message: i18next.t("groups_added") })
    } catch (error) { next(error); }
  });

  app.get("/removeGroup/:groupId", async (req, res, next) => {
    try {
      const { groupId } = req.params;
      await groupsRepository.removeGroups({ groupId: groupId });
      await questionsRepository.deleteQuestions(groupId);
      res.json({ message: i18next.t("group_removed") })
    } catch (error) { next(error); }
  });

  app.get("/removeAllGroups", async (req, res, next) => {
    try {

      await groupsRepository.removeGroups();
      await questionsRepository.removeQuestions();

      res.json({ message: i18next.t("all_groups_removed") });
    } catch (error) { next(error); }
  });

}
