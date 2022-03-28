const { Sequelize } = require('sequelize');
const {
  POSTGRES_HOST: host,
  POSTGRES_PORT: port,
  POSTGRES_DB: db,
  POSTGRES_USER: user,
  POSTGRES_PASSWORD: password,
} = process.env;

const postgresUrl = `postgres://${user}:${password}@postgres:${port}/${db}`;

export const sequelize: typeof Sequelize = new Sequelize(postgresUrl); // Example for postgres
