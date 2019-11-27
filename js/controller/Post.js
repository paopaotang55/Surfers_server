"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Posts_1 = require("../models/Posts");
const Locations_1 = require("../models/Locations");
const Paticipants_1 = require("../models/Paticipants");
const Users_1 = require("../models/Users");
// Posts.belongsTo(Locations, {
//   foreignKey: "location_id",
//   targetKey: "id",
//   // as: "location_name"
// });
Paticipants_1.Participants.belongsTo(Posts_1.Posts, {
    foreignKey: "post_id",
    targetKey: "id"
});
Posts_1.Posts.belongsTo(Locations_1.Locations, {
    foreignKey: 'location_id',
    targetKey: 'id'
});
Posts_1.Posts.hasMany(Paticipants_1.Participants, {
    foreignKey: 'post_id',
    sourceKey: 'id'
});
Paticipants_1.Participants.belongsTo(Users_1.Users, {
    foreignKey: 'user_id',
    targetKey: 'id'
});
Posts_1.Posts.belongsTo(Users_1.Users, {
    foreignKey: 'host_id',
    targetKey: 'id'
});
class PostsController {
    getRoomList(req, res) {
        Posts_1.Posts.findAll({
            attributes: ['id', 'text', 'date'],
            include: [{
                    model: Locations_1.Locations,
                    required: true,
                    attributes: ['name'],
                }, {
                    model: Users_1.Users,
                    required: true,
                    attributes: ['id', 'name']
                }]
        })
            .then((datas) => {
            let result = [];
            for (let i = 0; i < datas.length; i++) {
                result.push({
                    id: datas[i].id,
                    host_id: datas[i].User.id,
                    host_name: datas[i].User.name,
                    location_name: datas[i].Location.name,
                    date: datas[i].date,
                    text: datas[i].text
                });
            }
            res.status(200).send(result);
        })
            .catch((err) => {
            res.status(500).send({
                error: {
                    status: 500,
                    message: 'db쪽 문제'
                }
            });
        });
    }
    getMyList(req, res) {
        Paticipants_1.Participants.findAll({
            attributes: ['post_id', 'user_id'],
            include: [
                {
                    model: Posts_1.Posts,
                    required: true,
                    attributes: ['date'],
                    include: [
                        { model: Locations_1.Locations, required: true, attributes: ["name"] }
                    ]
                },
                {
                    model: Users_1.Users,
                    required: true,
                    attributes: ['name']
                }
            ],
            where: {
                user_id: req.body.info.user_id
            }
        }).then((datas) => {
            let newdatas = [];
            for (let i = 0; i < datas.length; i++) {
                let dataElement = {
                    id: datas[i].post_id,
                    host_id: datas[i].user_id,
                    host_name: datas[i].User.name,
                    location_name: datas[i].Post.Location.name,
                    date: datas[i].Post.date
                };
                newdatas.push(dataElement);
            }
            res.status(200).send(newdatas);
        })
            .catch((err) => {
            res.status(500).send({
                error: {
                    status: 500,
                    message: '나의 모임 목록 불러오기 실패'
                }
            });
        });
    }
    makeRoomOrAddMyList(req, res) {
        // if (!req.query.user_id) {
        //   const params: PostsInterface = req.body;
        //   Posts.create<Posts>(params).then((datas: Posts) => {
        //     res.status(201).json(datas); // redirect("/room")문제있음. 프런트와 이야기 해야 함.
        //   });
        // } else {
        //   const params: ParticipantsInterface = {
        //     user_id: req.query.user_id,
        //     post_id: req.query.room_id
        //   };
        //   Participants.create<Participants>(params).then((datas: Participants) => {
        //     res.status(201).json(datas);
        //   });
        // }
        let array = Object.keys(req.body);
        if ((array.indexOf('location') === -1) || (array.indexOf('date') === -1) || (array.indexOf('text') === -1)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "body를 다음과 같이 수정해주세요,{location, date, text}"
                }
            });
        }
        let name = req.body.location;
        let date = req.body.date;
        let text = req.body.text;
        let host_id = +req.body.info.user_id;
        Locations_1.Locations.findOne({
            where: { name }
        })
            .then((data1) => {
            let post = {
                host_id,
                text,
                date,
                location_id: data1.id
            };
            Posts_1.Posts.create(post)
                .then((data2) => {
                Paticipants_1.Participants.create({
                    user_id: host_id,
                    post_id: data2.id
                })
                    .then((a) => {
                    Users_1.Users.findOne({
                        where: { id: data2.host_id }
                    })
                        .then((data3) => {
                        let data = {
                            host_name: data3.name,
                            location: name,
                            date: data2.date,
                            text: data2.text
                        };
                        res.status(201).send(data);
                    })
                        .catch((err) => {
                        res.status(500).send({
                            error: {
                                status: 500,
                                message: "모임 생성 실패"
                            }
                        });
                    });
                })
                    .catch((err) => {
                    res.status(500).send("db쪽 문제 Posts");
                });
            })
                .catch((err) => {
                res.status(500).send("db쪽 문제 Participants");
            });
        })
            .catch((err) => {
            res.status(500).send("db쪽 문제 Posts");
        });
    }
    getRoomInfo(req, res) {
        if (!("post_id" in req.query)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "body를 다음과 같이 수정해주세요,{post_id}"
                }
            });
        }
        let post_id = req.query.post_id;
        Posts_1.Posts.findOne({
            attributes: ["host_id", "date", "text", "pay"],
            include: [{
                    model: Locations_1.Locations,
                    required: true,
                    attributes: ["name"]
                },
                {
                    model: Users_1.Users,
                    required: true,
                    attributes: ["name"]
                }],
            where: { id: post_id }
        })
            .then((datas1) => {
            Paticipants_1.Participants.findAll({
                attributes: ["post_id"],
                include: [{
                        model: Users_1.Users,
                        required: true,
                        attributes: ['name'],
                    }],
                where: { post_id }
            })
                .then((datas2) => {
                let arr = [];
                for (let i = 0; i < datas2.length; i++) {
                    arr.push(datas2[i].User.name);
                }
                let result = {
                    id: post_id,
                    host_id: datas1.host_id,
                    host_name: datas1.User.name,
                    location_name: datas1.Location.name,
                    date: datas1.date,
                    text: datas1.text,
                    pay: datas1.pay,
                    participants: arr,
                };
                res.status(200).send(result);
            })
                .catch((err) => {
                res.status(500).send({
                    error: {
                        status: 500,
                        message: "룸을 불러 올수 없음"
                    }
                });
            });
        })
            .catch((err) => {
            res.status(500).send("db쪽 문제 Posts");
        });
    }
    //같이가기
    createFromList(req, res) {
        if (!("post_id" in req.body)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "body를 다음과 같이 수정해주세요,{ post_id }"
                }
            });
        }
        const post_id = req.body.post_id;
        let user_id = req.body.info.user_id;
        let data = { post_id, user_id };
        Paticipants_1.Participants.create(data)
            .then(() => {
            return res.status(200).send({ message: "성공적으로 등록되었습니다." });
        })
            .catch((err) => {
            return res.status(500).send({
                error: {
                    status: 500,
                    message: "같이가기 실패"
                }
            });
        });
    }
    //룸에서 나가기
    deleteFromList(req, res) {
        // console.log("delete pass");
        // const user_id: number = req.query.user_id;
        if (!("post_id" in req.query)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "body를 다음과 같이 수정해주세요,{ post_id }"
                }
            });
        }
        let post_id = req.query.post_id;
        let user_id = req.body.info.user_id;
        let options = {
            where: { user_id: user_id, post_id: post_id }
        };
        Paticipants_1.Participants.destroy(options)
            .then(() => {
            console.log("제거 성공");
            return res.status(200).send({ message: "성공적으로 제거되었습니다." });
        })
            .catch((err) => {
            return res.status(500).send({
                error: {
                    status: 500,
                    message: "목록에서 제거 실패"
                }
            });
        });
    }
}
exports.PostsController = PostsController;
//# sourceMappingURL=Post.js.map