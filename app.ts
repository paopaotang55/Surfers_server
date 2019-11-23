import express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import { PostsRoutes } from "./routes/Post";
import { DefaultRoutes } from "./routes/Default";
import { ChatRoutes } from "./routes/Chat";
import { hostname } from "os";

class App {
  public app: express.Application;
  public connectToServer: DefaultRoutes = new DefaultRoutes();
  public routeToPosts: PostsRoutes = new PostsRoutes();
  public routeToChats: ChatRoutes = new ChatRoutes();
  public http: any;
  public io: any;
  public test: any;
  public chats: any;

  constructor() {
    this.app = express().bind(this);

    this.http = require("http").Server(this.app);
    //업그레이드
    this.io = require("socket.io")(this.http);
    this.chats = this.io.of("/chats");

    this.chats.on("connection", (socket: any) => {
      console.log("connected");

      socket.on("joinRoom", (room: string) => {
        socket.join(room);
        console.log(`${room} room created`);
        console.log("socket rooms: ", Object.keys(socket.rooms));
      });

      socket.on("message", (data: any) => {
        //in this data we will have message datas and room
        console.log("message data:", data);
        const { user_id, post_id, text } = data;
        socket.to(post_id).emit("message", data);
        console.log(`message event got message ${data} in room ${post_id}`);
      });
    });

    this.config();

    this.connectToServer.routes(this.app);
    this.routeToPosts.routes(this.app);
    this.routeToChats.routes(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
  }
}

const server = new App();

export default server;
