const Sequelize = require("sequelize");

exports.chats = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: Sequelize.INTEGER,
  post_id: Sequelize.INTEGER,
  text: Sequelize.STRING
});
