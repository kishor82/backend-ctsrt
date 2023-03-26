import { deleteUserAction } from '../../controllers';
import { API_USER } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const deleteUserRoute = (server: Server) => {
  server.route([
    {
      method: 'DELETE',
      path: `${API_USER}/{id}`,
      options: {
        description: 'Delete user.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
        handler: deleteUserAction,
      },
    },
  ]);
};
