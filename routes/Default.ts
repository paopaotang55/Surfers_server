import Default from "../controller/Default"

export class DefaultRoutes {
  public routes(app: any): void {
    //서버접속 처리
    app.route("/").post(Default.deleteData)
  }
}
