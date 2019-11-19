import { Request, Response } from "express";
import { Posts, PostsInterface } from "../models/Posts";
import { Locations, LocationsInterface } from "../models/Locations";
import { Participants, ParticipantsInterface } from "../models/Paticipants";
import { DestroyOptions } from "sequelize/types";
import { RoomListInterface } from "./JsonInterfaces";
import { Room } from "socket.io";

Posts.belongsTo(Locations, {
  foreignKey: "location_id",
  targetKey: "id",
  as: "location_name"
});

Participants.hasMany(Posts, {
  foreignKey: "id",
  sourceKey: "post_id"
});

export class PostsController {
  public getRoomList(req: Request, res: Response) {
    Posts.findAll<Posts>({
      include: [{ model: Locations, as: "location_name", attributes: ["name"] }]
    })
      .then((datas: any) => {
        // Array<Posts>대신, 가공을 위해 any
        let newdatas = [];
        for (let i = 0; i < datas.length; i++) {
          let dataElement: RoomListInterface = {
            id: datas[i].id,
            host_id: datas[i].host_id,
            host_name: datas[i].host_name,
            location_name: datas[i].location_name.name,
            date: datas[i].date
          };
          newdatas.push(dataElement);
        }
        return res.json(newdatas);
      })
      .catch((err: Error) =>
        res.status(500).json({ message: "목록 불러오기 실패" })
      );
  }

  public getMyList(req: Request, res: Response) {
    console.log("id : ", req.params.user_id);
    Participants.findAll<Participants>({
      include: [
        {
          model: Posts,
          include: [
            { model: Locations, as: "location_name", attributes: ["name"] }
          ]
        }
      ],
      where: {
        user_id: req.params.user_id
      }
    }).then((datas: any) => {
      let newdatas = [];
      for (let i = 0; i < datas.length; i++) {
        let dataElement: RoomListInterface = {
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

  public makeRoomOrAddMyList(req: Request, res: Response) {
    if (!req.query.user_id) {
      const params: PostsInterface = req.body;
      Posts.create<Posts>(params).then((datas: Posts) => {
        res.status(201).json(datas); // redirect("/room")문제있음. 프런트와 이야기 해야 함.
      });
    } else {
      const params: ParticipantsInterface = {
        user_id: req.query.user_id,
        post_id: req.query.room_id
      };
      Participants.create<Participants>(params).then((datas: Participants) => {
        res.status(201).json(datas);
      });
    }
  }

  public deleteFromList(req: Request, res: Response) {
    // console.log("delete pass");
    const user_id: number = req.query.user_id;
    const post_id: number = req.query.room_id;

    const options: DestroyOptions = {
      where: { user_id: user_id, post_id: post_id }
    };
    Participants.destroy(options)
      .then(() =>
        res.status(204).json({ message: "성공적으로 제거되었습니다." })
      )
      .catch((err: Error) =>
        res.status(500).json({ message: "목록에서 제거 실패" })
      );
  }
}
