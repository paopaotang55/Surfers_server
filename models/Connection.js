const Sequelize = require("sequelize");
const env = process.env.NODE_ENV;
// const config = require(__dirname + "/../config/config.json")[env];

let sequelize;

if (env === "development") {
  sequelize = new Sequelize("TestDB", "root", "", {
    host: `127.0.0.1`,
    dialect: "mariadb",
    operatorsAliases: false
  });
}
console.log("test: ", env);

module.exports = sequelize;
global.sequelize = sequelize;
