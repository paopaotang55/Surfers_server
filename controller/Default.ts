import { Request, Response } from "express";
import Sequelize from "sequelize";

import { Posts } from "../models/Posts";
import { Participants } from "../models/Paticipants";
import { Chats } from "../models/Chats";

const Op = Sequelize.Op;

export default {
  deleteData: async () => {
    try {
      let ids = await Posts.findAll<Posts>({
        attributes: ["id"],
        where: {
          createdAt: {
            [Op.lte]: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
          }
        }
      });
      let ids2 = ids.map(item => item.id);
      await Posts.destroy({
        where: {
          id: {
            [Op.in]: ids2
          }
        }
      });
      await Participants.destroy({
        where: {
          post_id: {
            [Op.in]: ids2
          }
        }
      });
      await Chats.destroy({
        where: {
          post_id: {
            [Op.in]: ids2
          }
        }
      });
      console.log("생성한지 3개월 이상된 방 삭제");
    } catch (err) {
      console.log("생성한지 3개월 이상된 방 삭제 실패");
    }
  }
};
