
const questionServiceUrl = process.env.JORDI_ASK_SERVICE_URL || 'http://localhost:8003';


module.exports = function(app, axios, authMiddleware) {
    app.post("/game/uploadresult", authMiddleware, (req, res) => { });
    
    app.post("/game/answer", authMiddleware, async (req, res) => {
        const { data } = await axios.post(`${questionServiceUrl}/answer`, req.body);
        
        res.send(data);
    });
    
    app.get("/game/:id", (req, res) => { });
}