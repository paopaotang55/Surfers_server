"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const Port = 4000;
app_1.default.http.listen(Port, (err) => {
    if (err) {
        console.log(`Can't listen on Port ${Port}`);
        console.log(`Error message is: ${err}`);
    }
    else {
        console.log(`This server is listening on Port: ${Port}`);
    }
});
//# sourceMappingURL=index.js.map