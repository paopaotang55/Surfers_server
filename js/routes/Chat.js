"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chats_1 = require("../controller/Chats");
class ChatRoutes {
    constructor() {
        this.ChatsController = new Chats_1.ChatsController();
    }
    routes(app) {
        app.route("/chat").get(this.ChatsController.getChats);
    }
}
exports.ChatRoutes = ChatRoutes;
//# sourceMappingURL=Chat.js.map