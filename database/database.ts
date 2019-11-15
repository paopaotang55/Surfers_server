import { Sequelize } from "sequelize";

export const database = new Sequelize({
  host: `127.0.0.1`,
  database: "chiMe",
  dialect: "mariadb"
});
