"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
class Participants extends sequelize_1.Model {
}
exports.Participants = Participants;
Participants.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    },
    post_id: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    }
}, {
    tableName: "Participants",
    sequelize: database_1.database
});
Participants.sync().then(() => console.log("Participants table created"));
//# sourceMappingURL=Paticipants.js.map