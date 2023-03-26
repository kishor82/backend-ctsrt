import { createTodoAction } from '../../controllers';
import { API_TODO } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const createTodoRoute = (server: Server) => {
  server.route({
    method: 'POST',
    path: `${API_TODO}`,
    options: {
      description: 'Create Todo.',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
        }),
      },
      handler: createTodoAction,
    },
  });
};
