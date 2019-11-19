import { Request, Response } from "express";
import { PostsController } from "../controller/Post";

export class PostsRoutes {
  public postsController: PostsController = new PostsController();
  public routes(app: any): void {
    //모임 생성 혹은 쿼리에 따라 내 리스트에 추가
    app.route("/posts").post(this.postsController.makeRoomOrAddMyList);

    //전체 모음목록 데이터 get
    app.route("/posts").get(this.postsController.getRoomList);

    //유저 모임목록 데이터 get
    app.route("/posts/:user_id").get(this.postsController.getMyList);

    //유저 모임 나가기
    app
      .route("/posts") //example = /posts?user_id=15&room_id=20
      .delete(this.postsController.deleteFromList);
  }
}
