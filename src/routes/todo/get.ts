import { getTodoAction } from '../../controllers';
import { API_TODO } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const getTodosRoutes = (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: `${API_TODO}`,
      options: {
        description: 'Get all Todos',
        tags: ['api'],
        validate: {
          query: Joi.object({
            keyword: Joi.string().default('').allow(''),
            pageNumber: Joi.number().default(1).optional(),
            pageSize: Joi.number().default(10).optional(),
          }),
        },
        handler: getTodoAction,
      },
    },
    {
      method: 'GET',
      path: `${API_TODO}/{id}`,
      options: {
        description: 'Get Todo By id.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
        handler: getTodoAction,
      },
    },
  ]);
};
