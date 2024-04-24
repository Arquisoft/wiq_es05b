const WikidataGenerator = require("../WikidataGenerator");
const script = require("../scripts/script")

module.exports = function (app, questionsRepository, groupsRepository) {

    const i18next = app.get("i18next");

    app.get("/gen/:groupId", async (req, res, next) => {
        
        try {

            const {groupId} = req.params;

            let group = await groupsRepository.findGroups({groupId: groupId});
            
            if (!group[0]) {
                return next({status:404, error: "Group not found"});
            }

            group = group[0];

            const generator = new WikidataGenerator(group);

            generator.generate().then(questions => {

                questionsRepository.deleteQuestions(groupId).then(() => {
                    questionsRepository.insertQuestions(questions).then(() => {
                        res.json({message: "Questions generated successfully: " + groupId});
                        console.log("Questions generated successfully: " + groupId)
                    }).catch(error => {
                        console.log("XD")
                        console.log(error);
                        next(error);
                    });
                })

            }).catch(error => {
                console.log(error);
                next(error);
            });


        } catch (error) {
            next(error);
        }
        
        
    
    });

    app.get("/gen", async (req, res , next) => {
        try {

           await script(groupsRepository, questionsRepository, WikidataGenerator);
            res.json({message: "All questions generated successfully"});
            
        } catch (error) {
            next(error);
        }
    });

    app.post("/addGroups", async (req, res, next) => {
        try {
            
            const groups = req.body;
            
            for (let group of groups) {
                await groupsRepository.insertGroup(group);
            }

            res.json({message: "Groups added successfully"})

        } catch (error) {
            next(error);
        }
    });

    app.get("/removeGroup/:groupId", async (req, res, next) => {
        try {
            const {groupId} = req.params;
            await groupsRepository.removeGroup(groupId);
            res.json({message: "Group removed successfully"})
        } catch (error) {
            next(error);
        }
    });

}
