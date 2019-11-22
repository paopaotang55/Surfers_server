import { Request, Response } from "express";

export class ChatRoutes {
  public routes(app: any): void {
    app.route("/").post();

    app.route("/").get();
  }
}
