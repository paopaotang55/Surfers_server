import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../database/database";

export class Ads extends Model {
  public id!: number;
  public image?: Blob;
  public url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ads.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    image: {
      type: new DataTypes.BLOB(),
      allowNull: true
    },
    url: {
      type: new DataTypes.STRING()
    }
  },
  {
    tableName: "Ads",
    sequelize: database
  }
);

Ads.sync({ force: true }).then(() => console.log("Ads table created"));
