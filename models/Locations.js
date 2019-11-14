const Sequelize = require("sequelize");

module.exports = {
  locations: sequelize.define("locations", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: Sequelize.STRING
  })
};
