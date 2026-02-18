const express = require("express");
const app = express();

app.use(express.json());

app.post("/data", (req, res) => {
    console.log("Received from TRB145:", req.body);
    res.status(200).send("OK");
});

app.get("/", (req, res) => {
    res.send("API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
