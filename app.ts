import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import { PostsRoutes } from "./routes/Post";
import { DefaultRoutes } from "./routes/Default";

class App {
  public app: express.Application;
  public connectToServer: DefaultRoutes = new DefaultRoutes();
  public routeToPosts: PostsRoutes = new PostsRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.connectToServer.routes(this.app);
    this.routeToPosts.routes(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
  }
}

export default new App().app;
