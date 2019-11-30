import { Request, Response } from "express"

export class DefaultRoutes {
  public routes(app: any): void {
    //서버접속 처리
    app.route("/").post((req: Request, res: Response) => { res.status(200).send("서버 연결됨") })
  }
}
