import { getPostAction } from '../../controllers';
import { API_POST } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const getPostsRoutes = (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: `${API_POST}`,
      options: {
        description: 'Get all Posts',
        tags: ['api'],
        handler: getPostAction,
        validate: {
          query: Joi.object({
            keyword: Joi.string().default('').allow(''),
            pageNumber: Joi.number().default(1).optional(),
            pageSize: Joi.number().default(10).optional(),
          }),
        },
      },
    },
    {
      method: 'GET',
      path: `${API_POST}/{id}`,
      options: {
        description: 'Get Post By id.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
        handler: getPostAction,
      },
    },
  ]);
};
