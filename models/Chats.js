const Sequelize = require("sequelize");

module.exports = {
  participants: sequelize.define("participants", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    post_id: Sequelize.INTEGER,
    text: Sequelize.STRING
  })
};
