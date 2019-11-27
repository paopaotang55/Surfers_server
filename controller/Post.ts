import { Request, Response } from "express";
import { Posts, PostsInterface } from "../models/Posts";
import { Locations, LocationsInterface } from "../models/Locations";
import { Participants, ParticipantsInterface } from "../models/Paticipants";
import { DestroyOptions } from "sequelize/types";
import { RoomListInterface } from "./JsonInterfaces";
import { Users } from "../models/Users";

// Posts.belongsTo(Locations, {
//   foreignKey: "location_id",
//   targetKey: "id",
//   // as: "location_name"
// });

Participants.belongsTo(Posts, {
  foreignKey: "post_id",
  targetKey: "id"
});
Posts.belongsTo(Locations, {
  foreignKey: 'location_id',
  targetKey: 'id'
})
Posts.hasMany(Participants, {
  foreignKey: 'post_id',
  sourceKey: 'id'
})
Participants.belongsTo(Users, {
  foreignKey: 'user_id',
  targetKey: 'id'
})
Posts.belongsTo(Users, {
  foreignKey: 'host_id',
  targetKey: 'id'
})


export class PostsController {
  public getRoomList(req: Request, res: Response) {
    Posts.findAll<Posts>({
      attributes: ['id', 'text', 'date'],
      include: [{
        model: Locations,
        required: true,
        attributes: ['name'],
      }, {
        model: Users,
        required: true,
        attributes: ['id', 'name']
      }]
    })
      .then((datas: any) => {
        let result = [];
        for (let i = 0; i < datas.length; i++) {
          result.push({
            id: datas[i].id,
            host_id: datas[i].User.id,
            host_name: datas[i].User.name,
            location_name: datas[i].Location.name,
            date: datas[i].date,
            text: datas[i].text
          })
        }
        res.status(200).send(result);
      })
      .catch((err: Error) => {
        res.status(500).send({
          error: {
            status: 500,
            message: 'db쪽 문제'
          }
        })
      })
  }

  public getMyList(req: Request, res: Response) {
    Participants.findAll<Participants>({
      attributes: ['post_id', 'user_id'],
      include: [
        {
          model: Posts,
          required: true,
          attributes: ['date'],
          include: [
            { model: Locations, required: true, attributes: ["name"] }
          ]
        },
        {
          model: Users,
          required: true,
          attributes: ['name']
        }
      ],
      where: {
        user_id: req.body.info.user_id
      }
    }).then((datas: any) => {
      let newdatas = [];
      for (let i = 0; i < datas.length; i++) {
        let dataElement: RoomListInterface = {
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
      .catch((err: Error) => {
        res.status(500).send({
          error: {
            status: 500,
            message: '나의 모임 목록 불러오기 실패'
          }
        })
      })
  }

  public makeRoomOrAddMyList(req: Request, res: Response) {
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
    let array: string[] = Object.keys(req.body);
    if ((array.indexOf('location') === -1) || (array.indexOf('date') === -1) || (array.indexOf('text') === -1)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요,{location, date, text}"
        }
      })
    }
    let name: string = req.body.location;
    let date: string = req.body.date;
    let text: string = req.body.text;
    let host_id: number = +req.body.info.user_id;
    Locations.findOne<Locations>({
      where: { name }
    })
      .then((data1: any) => {
        let post: PostsInterface = {
          host_id,
          text,
          date,
          location_id: data1.id
        };
        Posts.create<Posts>(post)
          .then((data2: Posts) => {
            Participants.create<Participants>({
              user_id: host_id,
              post_id: data2.id
            })
              .then((a: any) => {
                Users.findOne<Users>({
                  where: { id: data2.host_id }
                })
                  .then((data3: any) => {
                    let data = {
                      host_name: data3.name,
                      location: name,
                      date: data2.date,
                      text: data2.text
                    }
                    res.status(201).send(data)
                  })
                  .catch((err: Error) => {
                    res.status(500).send({
                      error: {
                        status: 500,
                        message: "모임 생성 실패"
                      }
                    })
                  })
              })
              .catch((err: Error) => {
                res.status(500).send("db쪽 문제 Posts")
              })
          })
          .catch((err: Error) => {
            res.status(500).send("db쪽 문제 Participants")
          })
      })
      .catch((err: Error) => {
        res.status(500).send("db쪽 문제 Posts")
      })
  }
  public getRoomInfo(req: Request, res: Response) {
    if (!("post_id" in req.query)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요,{post_id}"
        }
      })
    }
    let post_id: number = req.query.post_id;
    Posts.findOne<Posts>({
      attributes: ["host_id", "date", "text", "pay"],
      include: [{
        model: Locations,
        required: true,
        attributes: ["name"]
      },
      {
        model: Users,
        required: true,
        attributes: ["name"]
      }],
      where: { id: post_id }
    })
      .then((datas1: any) => {
        Participants.findAll<Participants>({
          attributes: ["post_id"],
          include: [{
            model: Users,
            required: true,
            attributes: ['name'],
          }],
          where: { post_id }
        })
          .then((datas2: any) => {
            let arr = [];
            for (let i = 0; i < datas2.length; i++) {
              arr.push(datas2[i].User.name)
            }
            let result: any = {
              id: post_id,
              host_id: datas1.host_id,
              host_name: datas1.User.name,
              location_name: datas1.Location.name,
              date: datas1.date,
              text: datas1.text,
              pay: datas1.pay,
              participants: arr,
            }
            res.status(200).send(result)
          })
          .catch((err: Error) => {
            res.status(500).send({
              error: {
                status: 500,
                message: "룸을 불러 올수 없음"
              }
            })
          })
      })
      .catch((err: Error) => {
        res.status(500).send("db쪽 문제 Posts")
      })
  }
  //같이가기
  public createFromList(req: Request, res: Response) {
    if (!("post_id" in req.body)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요,{ post_id }"
        }
      })
    }
    const post_id: number = req.body.post_id;
    let user_id: number = req.body.info.user_id;
    let data: ParticipantsInterface = { post_id, user_id }
    Participants.create<Participants>(data)
      .then(() => {
        return res.status(200).send({ message: "성공적으로 등록되었습니다." })
      })
      .catch((err: Error) => {
        return res.status(500).send({
          error: {
            status: 500,
            message: "같이가기 실패"
          }
        })
      });
  }
  //룸에서 나가기
  public deleteFromList(req: Request, res: Response) {
    // console.log("delete pass");
    // const user_id: number = req.query.user_id;
    if (!("post_id" in req.query)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요,{ post_id }"
        }
      })
    }
    let post_id: number = req.query.post_id;
    let user_id: number = req.body.info.user_id;
    let options: DestroyOptions = {
      where: { user_id: user_id, post_id: post_id }
    };
    Participants.destroy(options)
      .then(() => {
        console.log("제거 성공")
        return res.status(200).send({ message: "성공적으로 제거되었습니다." })
      })
      .catch((err: Error) => {
        return res.status(500).send({
          error: {
            status: 500,
            message: "목록에서 제거 실패"
          }
        })
      });
  }
}
