import { Request, Response } from "express";
import { Chats, ChatsInterface } from "../models/Chats";
import { Posts } from "../models/Posts";

//Chats.hasMany(Users, {sourceKey:"user_id", foreignKey:"id"})

export class ChatsController {
  public getChats(req: Request, res: Response) {
    const { post_id } = req.query.post_id;
    Chats.findAll<Chats>({ where: { post_id: post_id } }).then((datas: any) => {
      res.json(datas);
    });
  }
}
