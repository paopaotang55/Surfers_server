"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../controller/Post");
const user_1 = require("../controller/user");
class PostsRoutes {
    constructor() {
        this.postsController = new Post_1.PostsController();
        this.controller = new user_1.User();
    }
    routes(app) {
        //모임 생성 혹은 쿼리에 따라 내 리스트에 추가
        app.route("/posts").post(this.controller.token, this.postsController.makeRoomOrAddMyList);
        //전체 모음목록 데이터 get
        app.route("/posts").get(this.postsController.getRoomList);
        //유저 모임목록 데이터 get
        app.route("/posts/:user_id").get(this.postsController.getMyList);
        //유저 모임 나가기
        app
            .route("/posts") //example = /posts?user_id=15&room_id=20
            .delete(this.controller.token, this.postsController.deleteFromList);
    }
}
exports.PostsRoutes = PostsRoutes;
//# sourceMappingURL=Post.js.map