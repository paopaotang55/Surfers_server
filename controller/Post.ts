import { Request, Response } from "express";
import { Posts, PostsInterface } from "../models/Posts";

export class PostsController {
  public index(req: Request, res: Response) {
    Posts.findAll<Posts>({})
      .then((datas: Array<Posts>) => res.json(datas))
      .catch((err: Error) =>
        res.status(500).json({ message: "목록 불러오기 실패" })
      );
  }

  public create(req: Request, res: Response) {
    const params: PostsInterface = req.body;

    Posts.create<Posts>(params).then((datas: Posts) => {
      res
        .status(201)
        .json(datas)
        .redirect("/room");
    });
  }
}
