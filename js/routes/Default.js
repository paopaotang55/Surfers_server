"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultRoutes {
    routes(app) {
        //서버접속 처리
        app.route("/").get((req, res) => {
            res.send("서버의 응답을 받았습니다.");
        });
    }
}
exports.DefaultRoutes = DefaultRoutes;
//# sourceMappingURL=Default.js.map