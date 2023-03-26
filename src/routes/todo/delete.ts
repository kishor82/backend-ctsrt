import { deleteTodoAction } from '../../controllers';
import { API_TODO } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const deleteTodosRoutes = (server: Server) => {
  server.route({
    method: 'DELETE',
    path: `${API_TODO}/{id}`,
    options: {
      description: 'Delete Task By id.',
      tags: ['api'],
      validate: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
      },
      handler: deleteTodoAction,
    },
  });
};
