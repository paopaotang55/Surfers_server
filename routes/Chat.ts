import { Request, Response } from "express";
import { ChatsController } from "../controller/Chats";

export class ChatRoutes {
  public ChatsController: ChatsController = new ChatsController();

  public routes(app: any): void {
    app.route("/chat").get(this.ChatsController.getChats);
    app.route("/chat/push_token").put(this.ChatsController.post_pushToken);
    app.route("/chat/push_noti").post(this.ChatsController.GetNSendPushTokens);
  }
}
