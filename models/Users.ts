import { Model, DataTypes } from "sequelize";
import { database } from "../database/database";

export class Users extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password?: string;
  public image?: Blob;
  public img_url?: string;
  public oAuth!: number;
  public point?: number;
  public phone?: string;
  public level?: string;
  public pay_id?: string;
  public push_token?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(100),
      allowNull: false,
      unique: true
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
      type: new DataTypes.INTEGER()
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
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    push_token: {
      type: new DataTypes.STRING()
    }
  },
  {
    tableName: "Users",
    sequelize: database
  }
);

Users.sync().then(() => console.log("Users table created"));
<<<<<<< HEAD
=======

export interface UsersInterface {
  name: string;
  email: string;
  password?: string;
  image?: Blob;
  img_url?: string;
  oAuth: number;
  point?: number;
  phone?: string;
  level?: string;
  pay_id?: string;
}
>>>>>>> 3dae7062fb4a384f1045c5ab1d531dd5d9b1722b
