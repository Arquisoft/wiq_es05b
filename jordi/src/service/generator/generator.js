
const Capitals = require("./templates/Capitals.js");

async function script () {

    const capitalsInstance = new Capitals();
    
    try {
        const capitals = await capitalsInstance.generate(20);

        for (const capital of capitals) {
            console.log(capital.statement);
            console.log(capital.options);
        }
    } catch (error) {
        console.error("Error:", error);
    }

}

script();