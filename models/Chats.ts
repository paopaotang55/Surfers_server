import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../database/database";

export class Chats extends Model {
  public id!: number;
  public user_id!: number;
  public post_id!: number;
  public text?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Chats.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: new DataTypes.INTEGER(),
      allowNull: true
    },
    post_id: {
      type: new DataTypes.INTEGER(),
      allowNull: true
    },
    text: {
      type: new DataTypes.STRING()
    }
  },
  {
    tableName: "Chats",
    sequelize: database
  }
);

Chats.sync({ force: true }).then(() => console.log("Chats table created"));

export interface ChatsInterface {
  user_id: number;
  post_id: number;
  text: string;
}
