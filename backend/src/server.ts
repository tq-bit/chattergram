import app from './app/app';
import { sequelize } from './app/config/sequelize.config';

const host = process.env.BACKEND_HOST || '0.0.0.0';
const appPort = process.env.BACKEND_PORT || 8080;

(async function () {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await app.listen(appPort, host);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
})();
