"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../controller/user");
class Users {
    constructor() {
        this.controller = new user_1.User();
    }
    routes(app) {
        app.route('/user')
            .put(this.controller.token, this.controller.userPut);
        app.route('/user/signup')
            .post(this.controller.signup);
        app.route('/user/signin')
            .post(this.controller.signin);
    }
}
exports.Users = Users;
//# sourceMappingURL=User.js.map