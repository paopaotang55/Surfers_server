import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../database/database";

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
      type: new DataTypes.STRING()
    }
  },
  {
    tableName: "Locations",
    sequelize: database
  }
);

Locations.sync({ force: true }).then(() =>
  console.log("Locations table created")
);

export interface LocationsInterface {
  name: string;
}
