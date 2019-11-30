import { Request, Response } from "express";
import { Chats, ChatsInterface } from "../models/Chats";
import { Users } from "../models/Users";


// Chats.hasMany(Users, { sourceKey: "user_id", foreignKey: "id" });
//유저의 이름과 사진등을 가져와야 한다.

<<<<<<< HEAD
Chats.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });
Users.hasMany(Chats, { foreignKey: "user_id", sourceKey: "id" });
=======
// Chats.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });
>>>>>>> 3dae7062fb4a384f1045c5ab1d531dd5d9b1722b
export class ChatsController {
  public getChats(req: Request, res: Response) {
    //   Chats.findAll<Chats>({ where: { post_id: req.query.post_id } }).then(
    //     (datas: any) => {
    //       const newdatas = [];
    //       for (let i = 0; i < datas.length; i++) {
    //         const newobj = {
    //           _id: datas[i].id,
    //           text: datas[i].text,
    //           createdAt: datas[i].createdAt,
    //           post_id: datas[i].post_id + "",
    //           user: {
    //             _id: datas[i].user_id,
    //             name: "hyun",
    //             avatar:
    //               "https://t1.daumcdn.net/news/201908/07/tvreport/20190807162900279rijn.jpg"
    //           }
    //         };
    //         newdatas.push(newobj);
    //       }

    //       return res.json(newdatas);
    //     }
    //   );
    // }
    if (!("post_id" in req.query)) {
      return res.status(400).send({
        error: {
          status: 400,
          message: "다음과 같이 수정해주세요, post_id=1"
        }
      })
    }
    let post_id: number = req.query.post_id;
    Chats.findAll<Chats>({
      attributes: ["id", "post_id", "text", "createdAt"],
      include: [
        {
          model: Users,
          required: true,
          attributes: ["id", "name", "img_url"]
        }
      ],
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
              _id: data[i].id,
              name: data[i].User.name,
              avatar: data[i].User.img_url
            }
          });
        }
        res.status(200).send(result);
      })
      .catch((err: Error) => {
        res.status(500).send({
          error: {
            status: 500,
            message: "채팅 데이터 불어오기 실패"
          }
        });
      });
  }

  public async post_pushToken(req: Request, res: Response) {
    await Users.update<Users>(
      { push_token: req.body.push_token },
      { where: { email: req.body.email } }
    );
    await res.status(200).send({ message: "push_token 저장 완료" });
  }
}
