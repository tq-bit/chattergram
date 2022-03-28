import { sequelize } from '../config/sequelize.config';
import { DataTypes, Model } from 'sequelize';

class Security extends Model {
  declare id: number;
  declare userId: number;
  declare password: string;
}

Security.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Security',
    sequelize,
  }
);

export default Security;
