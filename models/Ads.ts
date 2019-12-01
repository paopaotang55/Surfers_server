import { Model, DataTypes } from "sequelize";
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
      type: new DataTypes.BLOB()
    },
    url: {
      type: new DataTypes.STRING(),
      allowNull: false
    }
  },
  {
    tableName: "Ads",
    sequelize: database
  }
);

Ads.sync().then(() => console.log("Ads table created"));
