import { getCommentAction } from '../../controllers';
import { API_POST } from '../../common/api_constants';
import { Server } from '@hapi/hapi';
import Joi from 'joi';
export const getCommentsRoutes = (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: `${API_POST}/{post_id}/comments`,
      options: {
        description: 'Get all Posts comments',
        tags: ['api'],
        validate: {
          params: Joi.object({
            post_id: Joi.number().required(),
          }),
          query: Joi.object({
            keyword: Joi.string().default('').allow(''),
            pageNumber: Joi.number().default(1).optional(),
            pageSize: Joi.number().default(10).optional(),
          }),
        },
        handler: getCommentAction,
      },
    },
    {
      method: 'GET',
      path: `${API_POST}/{post_id}/comments/{id}`,
      options: {
        description: 'Get Post comment.',
        tags: ['api'],
        validate: {
          params: Joi.object({
            post_id: Joi.number().required(),
            id: Joi.number().required(),
          }),
        },
        handler: getCommentAction,
      },
    },
  ]);
};
