import { createPostAction } from '../../controllers';
import { API_POST } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const createPostRoute = (server: Server) => {
  server.route({
    method: 'POST',
    path: `${API_POST}`,
    options: {
      description: 'Create Post.',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          body: Joi.string().required(),
        }),
      },
      handler: createPostAction,
    },
  });
};
