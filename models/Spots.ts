import { Model, DataTypes } from "sequelize";
import { database } from "../database/database";

export class Spots extends Model {
  public id!: number;
  public location_id!: number;
  public name!: string;
  public X!: number;
  public Y!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Spots.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    location_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    name: {
      type: new DataTypes.STRING(),
      allowNull: false
    },
    X: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    Y: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    }
  },
  {
    tableName: "Spots",
    sequelize: database
  }
);

Spots.sync().then(() => console.log("Spots table created"));
