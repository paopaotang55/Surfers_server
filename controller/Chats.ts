import { Request, Response } from "express";
import { Chats, ChatsInterface } from "../models/Chats";

export class ChatsController {
  public insertChat(req: Request, res: Response) {
    const params: any = {
      user_id: req.body.user_id,
      post_id: req.body.post_id,
      text: req.body.text
    };
    Chats.create<Chats>(params).then((datas: Chats) => {
      res.status(201).json(datas);
    });
  }
}
