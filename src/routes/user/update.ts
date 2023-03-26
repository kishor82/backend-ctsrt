import { updateUserAction } from '../../controllers';
import { API_USER } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const updateUserRoute = (server: Server) => {
  server.route([
    {
      method: 'PUT',
      path: `${API_USER}/{id}`,
      options: {
        description: 'Update user.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
          payload: Joi.object({
            name: Joi.string(),
            username: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string(),
          }),
        },
        handler: updateUserAction,
      },
    },
    {
      method: 'PUT',
      path: `${API_USER}/{id}/admin`,
      options: {
        description: 'Update user with admin rights.',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: 'admin',
        },
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
          payload: Joi.object({
            name: Joi.string(),
            username: Joi.string(),
            email: Joi.string().email(),
            role: Joi.string(),
            password: Joi.string(),
          }),
        },
        handler: updateUserAction,
      },
    },
  ]);
};
