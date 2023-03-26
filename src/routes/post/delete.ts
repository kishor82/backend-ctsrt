import { deletePostAction } from '../../controllers';
import { API_POST } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const deletePostsRoutes = (server: Server) => {
  server.route({
    method: 'DELETE',
    path: `${API_POST}/{id}`,
    options: {
      description: 'Delete Post By id.',
      tags: ['api'],
      validate: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
      },
      handler: deletePostAction,
    },
  });
};
