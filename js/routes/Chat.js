"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatRoutes {
    routes(app) {
        app.route("/").post();
        app.route("/").get();
    }
}
exports.ChatRoutes = ChatRoutes;
//# sourceMappingURL=Chat.js.map