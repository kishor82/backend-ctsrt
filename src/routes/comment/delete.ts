import { deleteCommentAction } from '../../controllers';
import { API_POST } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const deleteCommentsRoutes = (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: `${API_POST}/comment/{id}`,
      options: {
        description: 'Delete Post comment.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
        handler: deleteCommentAction,
      },
    },
  ]);
};
