"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chats_1 = require("../models/Chats");
const Users_1 = require("../models/Users");
// Chats.hasMany(Users, { sourceKey: "user_id", foreignKey: "id" })
//유저의 이름과 사진등을 가져와야 한다.
// Chats.belongsTo(Posts, { foreignKey: 'post_id', targetKey: 'id' });
// Chats.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id' })
Users_1.Users.hasMany(Chats_1.Chats, { foreignKey: 'user_id', sourceKey: 'id' });
class ChatsController {
    getChats(req, res) {
        let post_id = +req.query.post_id;
        Chats_1.Chats.findAll({
            attributes: ['id', 'post_id', 'text', 'createdAt'],
            include: [{
                    model: Users_1.Users,
                    required: true,
                    attributes: ['id', 'name', 'img_url']
                }],
            where: { post_id }
        })
            .then((data) => {
            let result = [];
            for (let i = 0; i < data.length; i++) {
                result.push({
                    _id: data[i].id,
                    post_id: data[i].post_id,
                    text: data[i].text,
                    createdAt: data[i].createdAt,
                    user: {
                        id: data[i].id, name: data[i].User.name, avatar: data[i].User.img_url
                    }
                });
            }
            res.status(200).send(result);
        })
            .catch((err) => {
            res.status(500).send({
                error: {
                    status: 500,
                    message: 'chat data 에러'
                }
            });
        });
    }
}
exports.ChatsController = ChatsController;
//# sourceMappingURL=Chats.js.map