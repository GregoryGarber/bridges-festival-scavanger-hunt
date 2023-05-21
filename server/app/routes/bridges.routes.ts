import bridgesController from "../controllers/bridges.controller";
import { Express, NextFunction, Request, Response } from "express";

function bridgesRoutes(app: Express) {
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/signUp", bridgesController.signUp);

  app.post("/api/signIn", bridgesController.signUp);

  app.put("/api/checkItem", bridgesController.checkItem);
}

export default bridgesRoutes;
