const script = async (groupsRepository, questionsRepository, WikidataGenerator) => {
    const groups = await groupsRepository.findGroups();
    for (let group of groups) {
        const generator = new WikidataGenerator(group);
        const questions = await generator.generate();

        if (questions.length === 0) continue;

        await questionsRepository.deleteQuestions(group.groupId);
        await questionsRepository.insertQuestions(questions);
    }
    console.log("Questions generated successfully")
}

module.exports = script;