import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  res.send("Gateway is running");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
