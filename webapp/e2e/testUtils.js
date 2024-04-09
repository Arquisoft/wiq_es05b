module.exports = {
    userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:8001",

    insertSampleUser: async (axios) => {

        const body = {
            username: "prueba",
            password: "Prueba1213$"
        }

        try{
            console.log("Inserting sample user for e2e tests...")
            const response = await axios.post(`http://localhost:8001/adduser`, body)
        }catch(error){
            console.error("Error inserting sample user for e2e tests: " + error)
        }
    }
}