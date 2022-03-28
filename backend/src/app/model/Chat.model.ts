import { sequelize } from '../config/sequelize.config';
import { DataTypes, Model, NOW } from 'sequelize';

class Chat extends Model {
  declare id: number;
  declare senderId: number;
  declare receiverId: number;
  declare dateSent: Date;
  declare audioFile?: Blob;
  declare audioFileUuid?: string;
  declare audioFileName?: string;
  declare audioFileMimetype?: string;
  declare text: string;
}

// TODO: Add filename and mimetype to columns
Chat.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateSent: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    audioFile: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    audioFileUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    audioFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioFileMimetype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioFileAccuracy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING(99999),
      allowNull: false,
    },
  },
  {
    tableName: 'Chat',
    sequelize,
  }
);

export default Chat;
