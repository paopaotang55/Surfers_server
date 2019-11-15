const Sequelize = require("sequelize");

exports.users = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  image: Sequelize.BLOB,
  img_url: Sequelize.STRING,
  oAuth: Sequelize.BOOLEAN,
  point: Sequelize.INTEGER,
  phone: Sequelize.STRING,
  level: Sequelize.STRING,
  pay_id: Sequelize.STRING
});
