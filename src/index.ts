import { Server } from '@hapi/hapi';
import { routes } from './routes';
import Inert from '@hapi/inert';
import config from './config';
import logging from './plugins/logging';
import { createMongoConnection, registerModels } from './data_access';
import getServerOptions from './plugins/http_tools';
import registerPlugins from './plugins/register_plugins';
import { migrateUsers } from './utils/migrate_users';

(async () => {
  const server = new Server(getServerOptions(config.server));
  await server.register([{ plugin: Inert }]);
  await logging(server, config);
  try {
    // await registerStrategy(server, config);
    await registerPlugins(server);
    const dbConnection = await createMongoConnection({ server, config });
    await registerModels(dbConnection);
    routes(server);
    migrateUsers();
    await server.start();
    server.log(['info', 'env'], process.env.NODE_ENV ? process.env.NODE_ENV : 'development'); // Add this into default logging
    server.log(['info', 'listening'], ` Server running at ${server.info.uri}`);
    server.log(['info', 'swagger', 'listening'], `Visit  ${server.info.uri}/documentation# for API documentation.`);
  } catch (err) {
    let reason: any = err;
    if (reason) {
      if (reason.code === 'EADDRINUSE' && Number.isInteger(reason.port)) {
        reason = new Error(`Port ${reason.port} is already in use!`);
      }
      server.log(['fatal'], reason);
      server.stop();
    }
  }
  process.on('unhandledRejection', (err: any) => {
    server.log(['fatal'], err);
  });
})();
