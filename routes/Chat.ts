import { Request, Response } from "express";
import { ChatsController } from "../controller/Chats";

export class ChatRoutes {
  public ChatsController: ChatsController = new ChatsController();

  public routes(app: any): void {
    app.route("/chats").get(this.ChatsController.getChats);
  }
}
