import { Sequelize } from "sequelize";

export const database = new Sequelize({
  host: `127.0.0.1`,
  password: "",
  database: "chiMe",
  dialect: "mariadb",
  dialectOptions: {
    useUTC: false
  },
  timezone: "Etc/GMT0"
});
