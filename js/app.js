"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const Post_1 = require("./routes/Post");
const Default_1 = require("./routes/Default");
const Chat_1 = require("./routes/Chat");
class App {
    constructor() {
        this.connectToServer = new Default_1.DefaultRoutes();
        this.routeToPosts = new Post_1.PostsRoutes();
        this.routeToChats = new Chat_1.ChatRoutes();
        this.app = express_1.default().bind(this);
        this.http = require("http").Server(this.app);
        //업그레이드
        this.io = require("socket.io")(this.http);
        this.io.on("connection", (socket) => {
            console.log("connected");
            socket.on("chatEvent", (room) => {
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
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors_1.default());
    }
}
const server = new App();
exports.default = server;
//# sourceMappingURL=app.js.map