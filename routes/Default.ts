import { Request, Response } from "express";

export class DefaultRoutes {
  public routes(app: any): void {
    //서버접속 처리
    app.route("/").get((req: Request, res: Response) => {
      res.send("서버의 응답을 받았습니다.");
    });
  }
}
