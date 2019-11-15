const Sequelize = require("sequelize");

exports.posts = sequelize.define("posts", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  host_id: Sequelize.INTEGER,
  text: Sequelize.STRING,
  date: Sequelize.STRING,
  date: Sequelize.STRING,
  location_id: Sequelize.INTEGER,
  pay: Sequelize.BOOLEAN
});
