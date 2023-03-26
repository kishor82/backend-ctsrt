import { updateTodoAction } from '../../controllers';
import { API_TODO } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const updateTodoRoute = (server: Server) => {
  server.route([
    {
      method: 'PUT',
      path: `${API_TODO}/{id}/complete`,
      options: {
        description: 'Mark as complete.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
        handler: updateTodoAction,
      },
    },
    {
      method: 'PUT',
      path: `${API_TODO}/{id}`,
      options: {
        description: 'Update todo.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
          payload: Joi.object({
            title: Joi.string().required(),
          }),
        },
        handler: updateTodoAction,
      },
    },
  ]);
};
