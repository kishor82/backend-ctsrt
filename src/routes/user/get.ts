import { getUserAction } from '../../controllers';
import { API_USER } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const getUsersRoutes = (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: `${API_USER}`,
      options: {
        description: 'Get all Users',
        tags: ['api'],
        validate: {
          query: Joi.object({
            keyword: Joi.string().default('').allow(''),
            pageNumber: Joi.number().default(1).optional(),
            pageSize: Joi.number().default(10).optional(),
          }),
        },
        handler: getUserAction,
      },
    },
    {
      method: 'GET',
      path: `${API_USER}/{id}`,
      options: {
        description: 'Get User By id.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
        handler: getUserAction,
      },
    },
  ]);
};
