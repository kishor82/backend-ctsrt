import { createUserAction } from '../../controllers';
import { API_ROUTE_USER_REGISTER } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const createUserRoute = (server: Server) => {
  server.route({
    method: 'POST',
    path: `${API_ROUTE_USER_REGISTER}`,
    options: {
      auth: false,
      description: 'Register new user.',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          username: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      },
      handler: createUserAction,
    },
  });
};
