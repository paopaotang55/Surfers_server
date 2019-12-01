import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../database/database";
import { Posts } from "./Posts";

export class Locations extends Model {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Locations.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(),
      allowNull: false
    }
  },
  {
    tableName: "Locations",
    sequelize: database
  }
);

Locations.sync().then(() => console.log("Locations table created"));

export interface LocationsInterface {
  name: string;
}
