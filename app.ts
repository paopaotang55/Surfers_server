import express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import { PostsRoutes } from "./routes/Post";
import { DefaultRoutes } from "./routes/Default";
import { ChatRoutes } from "./routes/Chat";

class App {
  public app: express.Application;
  public connectToServer: DefaultRoutes = new DefaultRoutes();
  public routeToPosts: PostsRoutes = new PostsRoutes();
  public routeToChats: ChatRoutes = new ChatRoutes();
  public http: any;
  public io: any;
  public test: any;

  constructor() {
    this.app = express().bind(this);

    this.http = require("http").Server(this.app);
    //업그레이드
    this.io = require("socket.io")(this.http);

    this.io.on("connection", (socket: any) => {
      console.log("connected");

      socket.on("chatEvent", (room: string) => {
        socket.join(room);
        console.log(`${room} room created`);
        console.log("socket rooms: ", Object.keys(socket.rooms));
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
