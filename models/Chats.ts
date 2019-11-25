import { Model, DataTypes } from "sequelize";
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
      allowNull: false
    },
    post_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false
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


Chats.sync().then(() => console.log("Chats table created"));

export interface ChatsInterface {
  user_id: number;
  post_id: number;
  text: string;
}
