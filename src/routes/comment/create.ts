import { createCommentAction } from '../../controllers';
import { API_POST } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const createCommentRoute = (server: Server) => {
  server.route({
    method: 'POST',
    path: `${API_POST}/{post_id}/comment`,
    options: {
      description: 'Add Post Comment.',
      tags: ['api'],
      validate: {
        params: Joi.object({
          post_id: Joi.number().required(),
        }),
        payload: Joi.object({
          body: Joi.string().required(),
        }),
      },
      handler: createCommentAction,
    },
  });
};
