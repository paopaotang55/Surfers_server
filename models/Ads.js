const Sequelize = require("sequelize");

module.exports = {
  ads: sequelize.define("ads", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    image: Sequelize.BLOB,
    url: Sequelize.STRING
  })
};
