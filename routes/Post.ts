import { Request, Response } from "express";

export class PostsRoutes {
  public routes(app): void {
    //모임 생성
    app.route("/posts").post((req: Request, res: Response) => {});

    //전체 모음목록 데이터 get
    app.route("/posts").get((req: Request, res: Response) => {});

    //유저 모임목록 데이터 get
    app.route("/posts/:user_id").get((req: Request, res: Response) => {});

    //유저 모임 나가기 이건 아직 미정. 프런트분들과 이야기
    app
      .route("/posts/:user_id/:post_id")
      .delete((req: Request, res: Response) => {});
  }
}
