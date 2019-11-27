import { User } from "../controller/user"

export class Users {
    public controller: User = new User();

    public routes(app: any): void {
        app.route('/user')
            .put(this.controller.token, this.controller.userPut)
        app.route('/user/signup')
            .post(this.controller.signup)
        app.route('/user/signin')
            .post(this.controller.signin)
    }
}
