"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../controller/Post");
class PostsRoutes {
    constructor() {
        this.postsController = new Post_1.PostsController();
    }
    routes(app) {
        //모임 생성
        app.route("/posts").post(this.postsController.create);
        //전체 모음목록 데이터 get
        app.route("/posts").get(this.postsController.index);
        //유저 모임목록 데이터 get
        app.route("/posts/:user_id").get((req, res) => { });
        //유저 모임 나가기 이건 아직 미정. 프런트분들과 이야기
        app
            .route("/posts/:user_id/:post_id")
            .delete((req, res) => { });
    }
}
exports.PostsRoutes = PostsRoutes;
//# sourceMappingURL=Post.js.map