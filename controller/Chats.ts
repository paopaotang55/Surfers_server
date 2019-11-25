import { Request, Response } from "express";
import { Chats, ChatsInterface } from "../models/Chats";
import { Posts } from "../models/Posts";

//Chats.hasMany(Users, {sourceKey:"user_id", foreignKey:"id"})
//유저의 이름과 사진등을 가져와야 한다.

export class ChatsController {
  public getChats(req: Request, res: Response) {
    console.log("post_id: ", req.query.post_id);
    Chats.findAll<Chats>({ where: { post_id: req.query.post_id } }).then(
      (datas: any) => {
        const newdatas = [];
        for (let i = 0; i < datas.length; i++) {
          const newobj = {
            _id: datas[i].id,
            text: datas[i].text,
            createdAt: datas[i].createdAt,
            post_id: datas[i].post_id + "",
            user: {
              id: 0,
              name: "hyun",
              avatar:
                "https://t1.daumcdn.net/news/201908/07/tvreport/20190807162900279rijn.jpg"
            }
          };
          newdatas.push(newobj);
        }
        return res.json(newdatas);
      }
    );
  }
}
