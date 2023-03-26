import { refreshSessionAction } from '../../controllers';
import { API_ROUTE_REFRESH_SESSION } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';

export const refreshSessionRoute = (server: Server) => {
  server.route({
    method: 'POST',
    path: `${API_ROUTE_REFRESH_SESSION}`,
    options: {
      auth: false,
      description: 'Refresh Session',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          expiredToken: Joi.string()
            .regex(/^[\w-]*\.[\w-]*\.[\w-]*$/)
            .required(),
        }),
      },

      handler: refreshSessionAction,
    },
  });
};
