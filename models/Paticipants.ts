import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../database/database";

export class Participants extends Model {
  public id!: number;
  public user_id!: number;
  public post_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Participants.init(
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
    }
  },
  {
    tableName: "Participants",
    sequelize: database
  }
);

Participants.sync().then(() => console.log("Participants table created"));

export interface ParticipantsInterface {
  user_id: number;
  post_id: number;
}
