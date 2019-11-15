import { Sequelize } from "sequelize";

export const database = new Sequelize({
  host: `127.0.0.1`, //db 호스트 url
  database: "chiMe", // 데이터베이스 이름
  dialect: "mariadb" // 데이터베이스 타입
});
