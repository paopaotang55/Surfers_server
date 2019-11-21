"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
class Posts extends sequelize_1.Model {
}
exports.Posts = Posts;
Posts.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    host_id: {
        type: new sequelize_1.DataTypes.INTEGER()
    },
    text: {
        type: new sequelize_1.DataTypes.STRING()
    },
    date: {
        type: new sequelize_1.DataTypes.STRING()
    },
    location_id: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: false
    },
    pay: {
        type: new sequelize_1.DataTypes.TINYINT()
    }
}, {
    tableName: "Posts",
    sequelize: database_1.database
});
Posts.sync().then(() => console.log("Posts table created"));
//# sourceMappingURL=Posts.js.map