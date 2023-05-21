import cors from "cors";
import serverless from "serverless-http";
import { NextFunction, Request, Response } from "express";
import express from "express";
import bridgesSchema from "./models/bridges.model";
import bridgesRoutes from "./routes/bridges.routes";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

async function start() {
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to The Bridges Festival" });
  });

  bridgesRoutes(app);

  app.listen(4000, () => {
    console.log("Listening on port 4005");
  });
}

start();
module.exports.handler = serverless(app);
