"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatRoutes {
    routes(app) {
        app.route("/chat/:post_id").post((req, res) => { });
        app.route("/chat/:post_id").get();
    }
}
exports.ChatRoutes = ChatRoutes;
//# sourceMappingURL=Chat.js.map