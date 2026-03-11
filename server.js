const express = require("express");
const app = express();
app.use(express.json());

const MAX_READINGS = 1000;
const readings = [];

function handleData(req, res) {
  console.log("Received from TRB145:", JSON.stringify(req.body));
  const payload = req.body;
  let registers = null;

  try {
    // TRB145 envía con clave "rtu_input1", no "data"
    const entries = payload?.rtu_input1 || payload?.data;
    if (entries?.[0]?.data) {
      registers = JSON.parse(entries[0].data);
    }
  } catch (e) {
    console.error("Parse error:", e);
  }

  if (registers) {
    readings.push({
      timestamp: new Date().toISOString(),
      data: registers,
    });
    if (readings.length > MAX_READINGS) readings.shift();
  }

  res.status(200).send("OK");
}

app.post("/", handleData);
app.post("/data", handleData);

app.get("/latest", (req, res) => {
  res.json(readings.length ? readings[readings.length - 1] : null);
});

app.get("/history", (req, res) => {
  const n = Math.min(parseInt(req.query.n) || 50, MAX_READINGS);
  res.json(readings.slice(-n));
});

app.get("/", (req, res) => {
  res.json({
    status: "running",
    total_readings: readings.length,
    last_reading: readings.length ? readings[readings.length - 1].timestamp : null,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
