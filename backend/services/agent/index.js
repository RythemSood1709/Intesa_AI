import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use((err, req, res, next) => {
  console.log(err);

  if (err?.status) {
    return res.status(err?.status).json(err?.data);
  }

  return res.status(500).json({ message: `Agent Error ${err}` });
});

app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
  res.send("Agent is running");
});

app.listen(port, () => {
  console.log(`Agent is running on port ${port}`);
  connectDB();
});
