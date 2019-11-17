import { Sequelize } from "sequelize";

export const database = new Sequelize("chiMe", "root", "", {
  host: `localhost`,
  dialect: "mariadb",
  dialectOptions: {
    useUTC: false
  },
  timezone: "Etc/GMT0"
});
