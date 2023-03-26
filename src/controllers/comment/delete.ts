import { ICommentController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';

export default ({ commentCollection }: ICommentController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { id: userId } = request.auth.credentials as any;
      const comment = await commentCollection.getComment({ id: Number(id) });
      if (!comment) {
        throw generateCustomError('Comment not found', 404);
      }
      if (comment.userId !== userId) {
        throw generateCustomError('You are not authorized to delete this comment', 401);
      }

      await commentCollection.deleteCommentById({ id });
      return h
        .response({
          statusCode: 200,
          data: {
            message: 'Comment deleted!',
          },
        })
        .code(200);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
