import { Request, Response } from "express";
import { Posts, PostsInterface } from "../models/Posts";
import { Locations, LocationsInterface } from "../models/Locations";
import { Participants, ParticipantsInterface } from "../models/Paticipants";
import { DestroyOptions } from "sequelize/types";

Posts.belongsTo(Locations, {
  foreignKey: "location_id",
  targetKey: "id",
  as: "location_name"
});

Participants; //User가 필요.

export class PostsController {
  public getRoomList(req: Request, res: Response) {
    Posts.findAll<Posts>({
      // include: [{ model: Locations, attributes: ["name"] }]
      include: [{ model: Locations, as: "location_name", attributes: ["name"] }] // API수정에 관해 이야기
    })
      .then((datas: Array<Posts>) => res.json(datas))
      .catch((err: Error) =>
        res.status(500).json({ message: "목록 불러오기 실패" })
      );
  }

  public getMyList(req: Request, res: Response) {
    // 유저가 필요.
    console.log("id : ", req.params.user_id);
    // Posts.findAll<Posts>({
    //   include: [{ model: Locations, attributes: ["name"] }]
    // })
    //   .then((datas: Array<Posts>) => res.json(datas))
    //   .catch((err: Error) =>
    //     res.status(500).json({ message: "목록 불러오기 실패" })
    //   );
  }

  public makeRoomOrAddMyList(req: Request, res: Response) {
    // console.log("query: ", req.query);
    if (!req.query.user_id) {
      const params: PostsInterface = req.body;
      // console.log("params: ", params);
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
    console.log("delete pass");
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
