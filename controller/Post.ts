import { Request, Response } from "express";
import { Posts, PostsInterface } from "../models/Posts";
import { Locations, LocationsInterface } from "../models/Locations";
import { Participants, ParticipantsInterface } from "../models/Paticipants";
import { DestroyOptions } from "sequelize/types";
import { RoomListInterface } from "./JsonInterfaces";
import { Users } from "../models/Users";
import { Chats } from "../models/Chats";
import { Spots } from "../models/Spots";

// Posts.belongsTo(Locations, {
//   foreignKey: "location_id",
//   targetKey: "id"
// });
// Posts.belongsTo(Users, {
//   foreignKey: "host_id",
//   targetKey: "id"
// });
// Participants.belongsTo(Posts, {
//   foreignKey: "post_id",
//   targetKey: "id"
// });
// Participants.belongsTo(Users, {
//   foreignKey: "user_id",
//   targetKey: "id"
// });
// Chats.belongsTo(Posts, {
//   foreignKey: "post_id",
//   targetKey: "id"
// });
// Chats.belongsTo(Users, {
//   foreignKey: "user_id",
//   targetKey: "id"
// });
// Spots.belongsTo(Locations, {
//   foreignKey: "location_id",
//   targetKey: "id"
// });
// Spots.hasMany(Posts, {
//   foreignKey: "spot_id",
//   sourceKey: "id"
// });
// Posts.belongsTo(Spots, {
//   foreignKey: "spot_id",
//   targetKey: "id"
// });

export class PostsController {
  //전체 모임 목록
  public getRoomList(req: Request, res: Response) {
    let user_id: number = req.body.info.user_id;
    Posts.findAll<Posts>({
      attributes: ["id", "text", "date"],
      include: [
        {
          model: Locations,
          required: true,
          attributes: ["name"]
        },
        {
          model: Users,
          required: true,
          attributes: ["id", "name"]
        },
        {
          model: Spots,
          required: true,
          attributes: ["name"]
        }
      ]
    })
      .then((datas: any) => {
        let result: any[] = [];
        for (let i = 0; i < datas.length; i++) {
          result.push({
            id: datas[i].id,
            host_id: datas[i].User.id,
            host_name: datas[i].User.name,
            location_name: datas[i].Location.name,
            date: datas[i].date,
            text: datas[i].text,
            spot_name: datas[i].Spot.name
          });
        }
        Participants.findAll<Participants>({
          attributes: ["post_id"],
          where: { user_id }
        })
          .then((data: any) => {
            let ids: number[] = data.map((item: any) => item.post_id);
            if (ids.length === 0) {
              result.forEach(item => {
                item.participate = false;
              });
              return res.status(200).send(result);
            } else {
              result.forEach(item => {
                if (ids.indexOf(item.id) !== -1) {
                  item.participate = true;
                } else {
                  item.participate = false;
                }
              });
              return res.status(200).send(result);
            }
          })
          .catch((err: Error) => {
            res.status(500).send("db쪽 문제 Participants");
          });
      })
      .catch((err: Error) => {
        res.status(500).send({
          error: {
            status: 500,
            message: "db쪽 문제"
          }
        });
      });
  }
  //나의 모입 목록
  public getMyList(req: Request, res: Response) {
    console.log("req.body.info.user_id: ", req.body.info);
    Participants.findAll<Participants>({
      attributes: ["post_id", "user_id"],
      include: [
        {
          model: Posts,
          required: true,
          attributes: ["date"],
          include: [
            { model: Locations, required: true, attributes: ["name"] },
            { model: Spots, required: true, attributes: ["name"] }
          ]
        },
        {
          model: Users,
          required: true,
          attributes: ["name"]
        }
      ],
      where: {
        user_id: req.body.info.user_id
      }
    })
      .then((datas: any) => {
        let newdatas = [];
        for (let i = 0; i < datas.length; i++) {
          let dataElement: RoomListInterface = {
            id: datas[i].post_id,
            host_id: datas[i].user_id,
            host_name: datas[i].User.name,
            location_name: datas[i].Post.Location.name,
            date: datas[i].Post.date,
            spot_name: datas[i].Post.Spot.name
          };
          newdatas.push(dataElement);
        }
        res.status(200).send(newdatas);
      })
      .catch((err: Error) => {
        res.status(500).send({
          error: {
            status: 500,
            message: "나의 모임 목록 불러오기 실패"
          }
        });
      });
  }
  //방 만들기 및 같이가자에 추가
  public makeRoomOrAddMyList(req: Request, res: Response) {
    let array: string[] = Object.keys(req.body);
    if (
      array.indexOf("location") === -1 ||
      array.indexOf("date") === -1 ||
      array.indexOf("text") === -1 ||
      array.indexOf("spot") === -1
    ) {
      return res.status(400).send({
        error: {
          status: 400,
          message:
            "body를 다음과 같이 수정해주세요,{location, date, text. spot}"
        }
      });
    }
    let name: string = req.body.location;
    let date: string = req.body.date;
    let text: string = req.body.text;
    let spot: string = req.body.spot;
    let host_id: number = req.body.info.user_id;
    Spots.findOne<Spots>({ where: { name: spot } })
      .then((data: any) => {
        Locations.findOne<Locations>({
          where: { name }
        })
          .then((data1: any) => {
            let post: PostsInterface = {
              host_id,
              text,
              date,
              location_id: data1.id,
              spot_id: data.id
            };
            Posts.create<Posts>(post)
              .then(data2 => {
                Participants.create<Participants>({
                  user_id: host_id,
                  post_id: data2.id
                })
                  .then(() => {
                    // Users.findOne<Users>({
                    //   where: { id: host_id }
                    // })
                    //   .then((data3: any) => {
                    //     let data = {
                    //       post_id: data2.id,
                    //       host_name: data3.name,
                    //       location: name,
                    //       spot,
                    //       date,
                    //       text
                    //     };
                    res.status(201).send({ post_id: data2.id });
                    //   })
                    //   .catch((err: Error) => {
                    //   res.status(500).send({
                    //     error: {
                    //       status: 500,
                    //       message: "모임 생성 실패"
                    //     }
                    //   });
                    // });
                  })
                  .catch((err: Error) => {
                    res.status(500).send({
                      error: {
                        status: 500,
                        message: "모임 생성 실패"
                      }
                    });
                  });
              })
              .catch((err: Error) => {
                res.status(500).send("db쪽 문제 Participants");
              });
          })
          .catch((err: Error) => {
            res.status(500).send("db쪽 문제 Posts");
          });
      })
      .catch((err: Error) => {
        res.status(500).send("db쪽 에러 Spots");
      });
  }
  //룸 내용 불어오기
  public getRoomInfo(req: Request, res: Response) {
    if (!("post_id" in req.query)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요,{post_id}"
        }
      });
    }
    let post_id: number = req.query.post_id;
    Posts.findOne<Posts>({
      attributes: ["host_id", "date", "text", "pay", "createdAt"],
      include: [
        {
          model: Locations,
          required: true,
          attributes: ["name"]
        },
        {
          model: Users,
          required: true,
          attributes: ["name"]
        },
        {
          model: Spots,
          required: true,
          attributes: ["name"]
        }
      ],
      where: { id: post_id }
    })
      .then((datas1: any) => {
        Participants.findAll<Participants>({
          attributes: ["post_id"],
          include: [
            {
              model: Users,
              required: true,
              attributes: ["name"]
            }
          ],
          where: { post_id }
        })
          .then((datas2: any) => {
            let arr: string[] = [];
            for (let i = 0; i < datas2.length; i++) {
              arr.push(datas2[i].User.name);
            }
            let result: any = {
              id: post_id,
              host_id: datas1.host_id,
              host_name: datas1.User.name,
              location_name: datas1.Location.name,
              date: datas1.date,
              text: datas1.text,
              pay: datas1.pay,
              createdAt: datas1.createdAt,
              spot_name: datas1.Spot.name,
              participants: arr
            };
            res.status(200).send(result);
          })
          .catch((err: Error) => {
            res.status(500).send({
              error: {
                status: 500,
                message: "룸을 불러 올수 없음"
              }
            });
          });
      })
      .catch((err: Error) => {
        res.status(500).send("db쪽 문제 Posts");
      });
  }

  //룸에 참여하기
  public joinInRoom(req: Request, res: Response) {
    if (!("post_id" in req.body)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "body를 다음과 같이 수정해주세요,{ post_id }"
        }
      });
    }
    let post_id: number = req.body.post_id;
    let user_id: number = req.body.info.user_id;

    Participants.findOne<Participants>({ where: { post_id, user_id } })
      .then((data: any) => {
        if (data) {
          return res.send("이미 참가하였습니다");
        } else {
          let data1: ParticipantsInterface = { post_id, user_id };
          Participants.create<Participants>(data1)
            .then(() => {
              return res
                .status(200)
                .send({ message: "성공적으로 등록되었습니다." });
            })
            .catch((err: Error) => {
              return res.status(500).send({
                error: {
                  status: 500,
                  message: "같이가기 실패"
                }
              });
            });
        }
      })
      .catch((err: Error) => {
        return res.status(500).send("db쪽 문제 Participants");
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
      });
    }
    let post_id: number = req.query.post_id;
    let user_id: number = req.body.info.user_id;
    let options: DestroyOptions = {
      where: { user_id: user_id, post_id: post_id }
    };
    Participants.destroy(options)
      .then(() => {
        return res.status(200).send({ message: "성공적으로 제거되었습니다." });
      })
      .catch((err: Error) => {
        return res.status(500).send({
          error: {
            status: 500,
            message: "목록에서 제거 실패"
          }
        });
      });
  }
  // 모든 지역
  getLocationList(req: Request, res: Response) {
    Locations.findAll<Locations>({})
      .then((datas: any) => {
        let arr: string[] = datas.map((item: any) => item.name);
        res.status(200).send(arr);
      })
      .catch((err: Error) => {
        res.status(500).send({
          error: {
            status: 500,
            message: "데이터 불러오기 실패"
          }
        });
      });
  }
  //spot 상세 정보
  getSpotInfo(req: Request, res: Response) {
    if (!("location_name" in req.query)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "다음과 같이 수정해주세요, location_name=제주"
        }
      });
    }
    let location_name: string = req.query.location_name;
    Spots.findAll<Spots>({
      attributes: ["name", "X", "Y"],
      include: [
        {
          model: Locations,
          attributes: ["name"],
          where: {
            name: location_name
          }
        }
      ]
    })
      .then((data: any) => {
        let arr = data.map((item: any) => {
          return { [item.name]: { x: item.X, y: item.Y } };
        });
        res.status(200).send(arr);
      })
      .catch((err: Error) => {
        res.status(500).send({ message: "db쪽 에러" });
      });
  }
  deleteRoom(req: Request, res: Response) {
    if (!("post_id" in req.query)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "post_id 없음"
        }
      })
    }
    let post_id: number = +req.query.post_id;
    Posts.destroy({ where: { id: post_id } })
      .then(() => {
        Participants.destroy({ where: { post_id } })
          .then(() => {
            Chats.destroy({ where: { post_id } })
              .then(() => {
                return res.status(200).send({ message: "성공적으로 삭제되었습니다" })
              })
              .catch((err: Error) => {
                return res.status(500).send(
                  {
                    error: {
                      status: 500,
                      message: "방 삭제 실패3"
                    }
                  }
                )
              })
          })
          .catch((err: Error) => {
            return res.status(500).send(
              {
                error: {
                  status: 500,
                  message: "방 삭제 실패2"
                }
              }
            )
          })
      })
      .catch((err: Error) => {
        return res.status(500).send(
          {
            error: {
              status: 500,
              message: "방 삭제 실패1"
            }
          }
        )
      })
  }
  putRoomInfo(req: Request, res: Response) {
    if (!("post_id" in req.body) || !("text" in req.body)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "다음 형식으로 수정 { post_id, text }"
        }
      })
    }
    let post_id: number = req.body.post_id;
    let text: string = req.body.text;
    Posts.update<Posts>({ text }, { where: { id: post_id } })
      .then(() => {
        Posts.findOne<Posts>({
          attributes: ["host_id", "date", "text", "pay", "createdAt"],
          include: [
            {
              model: Locations,
              required: true,
              attributes: ["name"]
            },
            {
              model: Users,
              required: true,
              attributes: ["name"]
            },
            {
              model: Spots,
              required: true,
              attributes: ["name"]
            }
          ],
          where: { id: post_id }
        })
          .then((datas1: any) => {
            Participants.findAll<Participants>({
              attributes: ["post_id"],
              include: [
                {
                  model: Users,
                  required: true,
                  attributes: ["name"]
                }
              ],
              where: { post_id }
            })
              .then((datas2: any) => {
                let arr: string[] = [];
                for (let i = 0; i < datas2.length; i++) {
                  arr.push(datas2[i].User.name);
                }
                let result: any = {
                  id: post_id,
                  host_id: datas1.host_id,
                  host_name: datas1.User.name,
                  location_name: datas1.Location.name,
                  date: datas1.date,
                  text: datas1.text,
                  pay: datas1.pay,
                  createdAt: datas1.createdAt,
                  spot_name: datas1.Spot.name,
                  participants: arr
                };
                res.status(200).send(result);
              })
              .catch((err: Error) => {
                res.status(500).send({
                  error: {
                    status: 500,
                    message: "방 수정 실패"
                  }
                });
              });
          })
          .catch((err: Error) => {
            return res.status(500).send(
              {
                error: {
                  status: 500,
                  message: "방 수정 실패"
                }
              }
            )
          });
      })
      .catch((err: Error) => {
        return res.status(500).send(
          {
            error: {
              status: 500,
              message: "방 수정 실패"
            }
          }
        )
      })
  }
}
// Spots.bulkCreate([
//   { location_id: 1, name: '천진', X: 87, Y: 142 },
//   { location_id: 1, name: '송지호', X: 86, Y: 144 },
//   { location_id: 1, name: '속초', X: 87, Y: 141 },
//   { location_id: 1, name: '설악', X: 87, Y: 140 },
//   { location_id: 1, name: '기사문', X: 89, Y: 137 },
//   { location_id: 1, name: '동산', X: 90, Y: 136 },
//   { location_id: 1, name: '죽도', X: 90, Y: 136 },
//   { location_id: 1, name: '인구', X: 90, Y: 136 },
//   { location_id: 1, name: '갯마을', X: 90, Y: 136 },
//   { location_id: 1, name: '남애3리', X: 90, Y: 136 },
//   { location_id: 1, name: '사천', X: 92, Y: 133 },
//   { location_id: 1, name: '금진', X: 95, Y: 129 },
//   { location_id: 1, name: '용화', X: 99, Y: 124 },
// ])
