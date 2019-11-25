"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
class Locations extends sequelize_1.Model {
}
exports.Locations = Locations;
Locations.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
    }
}, {
    tableName: "Locations",
    sequelize: database_1.database
});
Locations.sync().then(() => console.log("Locations table created"));
//# sourceMappingURL=Locations.js.map