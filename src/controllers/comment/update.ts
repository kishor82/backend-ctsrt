import { ICommentController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { IPost } from '../../models/post_model';

export default ({ commentCollection }: ICommentController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { body } = request.payload as IPost;
      const { id: userId } = request.auth.credentials as any;
      const comment = await commentCollection.getComment({ id: Number(id) });
      if (!comment) {
        throw generateCustomError('Comment not found', 404);
      }
      if (comment.userId !== userId) {
        throw generateCustomError('You are not authorized to update this comment', 401);
      }

      await commentCollection.updateCommentById({ id: Number(id), dataToUpdate: { body } });
      return h
        .response({
          statusCode: 201,
          data: {
            message: 'Comment updated!',
          },
        })
        .code(201);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
