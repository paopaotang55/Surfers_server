import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../database/database";

export class Posts extends Model {
  public id!: number;
  public name?: string;
  public email!: string;
  public password?: string;
  public image?: Blob;
  public img_url?: string;
  public oAuth!: boolean;
  public point!: number;
  public phone?: string;
  public level?: string;
  public pay_id?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Posts.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING()
    },
    email: {
      type: new DataTypes.STRING()
    },
    password: {
      type: new DataTypes.STRING()
    },
    image: {
      type: new DataTypes.BLOB()
    },
    img_url: {
      type: new DataTypes.STRING()
    },
    point: {
      type: new DataTypes.NUMBER()
    },
    phone: {
      type: new DataTypes.STRING()
    },
    level: {
      type: new DataTypes.STRING()
    },
    pay_id: {
      type: new DataTypes.STRING()
    },
    oAuth: {
      type: new DataTypes.TINYINT()
    }
  },
  {
    tableName: "Posts",
    sequelize: database
  }
);

Posts.sync({ force: true }).then(() => console.log("Posts table created"));
