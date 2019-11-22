"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chats_1 = require("../models/Chats");
class ChatsController {
    insertChat(req, res) {
        const params = {
            user_id: req.body.user_id,
            post_id: req.body.post_id,
            text: req.body.text
        };
        Chats_1.Chats.create(params).then((datas) => {
            res.status(201).json(datas);
        });
    }
}
exports.ChatsController = ChatsController;
//# sourceMappingURL=Chats.js.map