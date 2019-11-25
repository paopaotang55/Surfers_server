"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Posts_1 = require("../models/Posts");
const Locations_1 = require("../models/Locations");
const Paticipants_1 = require("../models/Paticipants");
// Posts.belongsTo(Locations, {
//   foreignKey: "location_id",
//   targetKey: "id",
//   // as: "location_name"
// });
// Participants.hasMany(Posts, {
//   foreignKey: "id",
//   sourceKey: "post_id"
// });
class PostsController {
    getRoomList(req, res) {
        Posts_1.Posts.findAll({
            include: [{ model: Locations_1.Locations, as: "location_name", attributes: ["name"] }]
        })
            .then((datas) => {
            // Array<Posts>대신, 가공을 위해 any
            let newdatas = [];
            for (let i = 0; i < datas.length; i++) {
                let dataElement = {
                    id: datas[i].id,
                    host_id: datas[i].host_id,
                    host_name: datas[i].host_name,
                    location_name: datas[i].location_name.name,
                    date: datas[i].date
                };
                newdatas.push(dataElement);
            }
            return res.json(newdatas);
            // return res.json(datas);
        })
            .catch((err) => res.status(500).json({ message: "목록 불러오기 실패" }));
    }
    getMyList(req, res) {
        // console.log("id : ", req.params.user_id);
        Paticipants_1.Participants.findAll({
            include: [
                {
                    model: Posts_1.Posts,
                    include: [
                        { model: Locations_1.Locations, as: "location_name", attributes: ["name"] }
                    ]
                }
            ],
            where: {
                user_id: req.params.user_id
            }
        }).then((datas) => {
            let newdatas = [];
            for (let i = 0; i < datas.length; i++) {
                let dataElement = {
                    id: datas[i].Posts[0].id,
                    host_id: datas[i].Posts[0].host_id,
                    host_name: datas[i].Posts[0].host_name,
                    location_name: datas[i].Posts[0].location_name.name,
                    date: datas[i].Posts[0].date
                };
                newdatas.push(dataElement);
            }
            return res.json(newdatas);
            // return res.json(datas);
        });
    }
    makeRoomOrAddMyList(req, res) {
        if (!req.query.user_id) {
            const params = req.body;
            Posts_1.Posts.create(params).then((datas) => {
                res.status(201).json(datas); // redirect("/room")문제있음. 프런트와 이야기 해야 함.
            });
        }
        else {
            const params = {
                user_id: req.query.user_id,
                post_id: req.query.room_id
            };
            Paticipants_1.Participants.create(params).then((datas) => {
                res.status(201).json(datas);
            });
        }
    }
    deleteFromList(req, res) {
        // console.log("delete pass");
        const user_id = req.query.user_id;
        const post_id = req.query.room_id;
        const options = {
            where: { user_id: user_id, post_id: post_id }
        };
        Paticipants_1.Participants.destroy(options)
            .then(() => res.status(204).json({ message: "성공적으로 제거되었습니다." }))
            .catch((err) => res.status(500).json({ message: "목록에서 제거 실패" }));
    }
}
exports.PostsController = PostsController;
//# sourceMappingURL=Post.js.map