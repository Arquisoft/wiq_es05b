const express = require('express');

const app = express();
const port = 8006;

app.use(express.json())

app.listen(port, () => {
    console.log(`History listening on port ${port}`);
});
