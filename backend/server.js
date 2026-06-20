const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Code Style Enforcer Backend Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});