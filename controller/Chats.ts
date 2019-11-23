import { Request, Response } from "express";
import { Chats, ChatsInterface } from "../models/Chats";
import { Posts } from "../models/Posts";

//Chats.hasMany(Users, {sourceKey:"user_id", foreignKey:"id"})
//유저의 이름과 사진등을 가져와야 한다.

export class ChatsController {
  public getChats(req: Request, res: Response) {
    const { post_id } = req.query.post_id;
    console.log("post_id: ", req.query.post_id);
    Chats.findAll<Chats>({ where: { post_id: req.query.post_id } }).then(
      (datas: any) => {
        res.json(datas);
      }
    );
  }
}
