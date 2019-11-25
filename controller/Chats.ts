import { Request, Response } from "express";
import { Chats, ChatsInterface } from "../models/Chats";
import { Users } from "../models/Users";
import { userInfo } from "os";

// Chats.hasMany(Users, { sourceKey: "user_id", foreignKey: "id" })
//유저의 이름과 사진등을 가져와야 한다.

// Chats.belongsTo(Posts, { foreignKey: 'post_id', targetKey: 'id' });
// Chats.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id' })
Users.hasMany(Chats, { foreignKey: 'user_id', sourceKey: 'id' })
export class ChatsController {
  public getChats(req: Request, res: Response) {
    let post_id: number = +req.query.post_id;
    Chats.findAll<Chats>({
      attributes: ['id', 'post_id', 'text', 'createdAt'],
      include: [{
        model: Users,
        required: true,
        attributes: ['id', 'name', 'img_url']
      }],
      where: { post_id }
    })
      .then((data: any) => {
        let result = [];
        for (let i = 0; i < data.length; i++) {
          result.push({
            _id: data[i].id,
            post_id: data[i].post_id,
            text: data[i].text,
            createdAt: data[i].createdAt,
            user: {
              id: data[i].id, name: data[i].User.name, avatar: data[i].User.img_url
            }
          })
        }
        res.status(200).send(result);
      })
      .catch((err: Error) => {
        res.status(500).send({
          error: {
            status: 500,
            message: 'chat data 에러'
          }
        })
      })
  }
}
