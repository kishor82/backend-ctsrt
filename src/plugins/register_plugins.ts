import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import * as HapiSwagger from 'hapi-swagger';
import { Server, ServerRegisterPluginObject } from '@hapi/hapi';
import eventHandlerPlugin from './event_handler';
import JwtHandler from './jwt_handler';

export default async (server: Server) => {
  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'API Documentation',
    },
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [{ jwt: [] }],
    auth: false,
    pathPrefixSize: 1,
  };

  const plugins: Array<ServerRegisterPluginObject<any>> = [
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
    {
      plugin: eventHandlerPlugin,
    },
    {
      plugin: JwtHandler,
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ];

  await server.register(plugins);
};
