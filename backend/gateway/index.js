import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config();

const port = process.env.PORT;

const app = express();

//middleware to redirect requests to the auth service
app.use("/auth", proxy(process.env.AUTH_SERVICE_URL));

app.get("/", (req, res) => {
  res.send("Gateway is running");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
