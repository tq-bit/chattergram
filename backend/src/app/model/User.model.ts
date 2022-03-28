import { sequelize } from '../config/sequelize.config';
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

class User extends Model {
  declare id?: number;
  declare email: string;
  declare username: string;
  declare bio?: string;
  declare avatar?: string;
  declare online: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: '404 bio not found',
    },
    avatar: {
      type: DataTypes.BLOB,
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'User',
    sequelize,
  }
);

export default User;
