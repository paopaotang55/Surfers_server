"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
class Chats extends sequelize_1.Model {
}
exports.Chats = Chats;
Chats.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: true
    },
    post_id: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: true
    },
    text: {
        type: new sequelize_1.DataTypes.STRING()
    }
}, {
    tableName: "Chats",
    sequelize: database_1.database
});
Chats.sync({ force: true }).then(() => console.log("Chats table created"));
//# sourceMappingURL=Chats.js.map