import { updatePostAction } from '../../controllers';
import { API_POST } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const updatePostRoute = (server: Server) => {
  server.route({
    method: 'PUT',
    path: `${API_POST}/{id}`,
    options: {
      description: 'Update post.',
      tags: ['api'],
      validate: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
        payload: Joi.object({
          title: Joi.string(),
          body: Joi.string(),
        }),
      },
      handler: updatePostAction,
    },
  });
};
