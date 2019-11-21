import { Request, Response } from "express";

export class ChatRoutes {
  public routes(app: any): void {
    app.route("/chat/:post_id").post((req: Request, res: Response) => {});

    app.route("/chat/:post_id").get();
  }
}
