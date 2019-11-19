import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../database/database";
import { Locations } from "./Locations";

export class Posts extends Model {
  public id!: number;

  public host_id!: number;
  public text!: string;
  public date!: string;
  public location_id!: number;
  public pay?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public location_name?: string;
}

Posts.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    host_id: {
      type: new DataTypes.INTEGER()
    },
    text: {
      type: new DataTypes.STRING()
    },
    date: {
      type: new DataTypes.STRING()
    },
    location_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    pay: {
      type: new DataTypes.TINYINT()
    }
  },
  {
    tableName: "Posts",
    sequelize: database
  }
);

Posts.sync().then(() => console.log("Posts table created"));

export interface PostsInterface {
  host_id: number;
  text: string;
  date: string;
  location_id: number;
  pay: boolean;
}