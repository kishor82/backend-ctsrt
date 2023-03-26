import { loginAction } from '../../controllers';
import { API_ROUTE_USER_LOGIN } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const loginRoute = (server: Server) => {
  server.route({
    method: 'POST',
    path: `${API_ROUTE_USER_LOGIN}`,
    options: {
      auth: false,
      description: 'User Login.',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          email: Joi.string().default('admin@email.com'),
          password: Joi.string().default('admin@123'),
        }),
      },
      handler: loginAction,
    },
  });
};
