import { ICommentController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { IComment } from '../../models/comment_model';

export default ({ commentCollection }: ICommentController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.auth.credentials as any;
      const { post_id } = request.params;
      const { body } = request.payload as IComment;
      const res = await commentCollection.createComment({ body, postId: post_id, userId: id });
      if (res) {
        return h
          .response({
            statusCode: 201,
            data: {
              message: 'Comment created successfully!',
            },
          })
          .code(201);
      } else {
        throw generateCustomError('Invalid input data.', 400);
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
