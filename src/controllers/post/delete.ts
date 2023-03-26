import { IPostController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';

export default ({ postCollection }: IPostController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { id: userId } = request.auth.credentials as any;
      const post = await postCollection.getPost({ id: Number(id) });
      if (!post) {
        throw generateCustomError('Post not found', 404);
      }
      if (post.userId !== userId) {
        throw generateCustomError('You are not authorized to delete this post', 401);
      }

      await postCollection.deletePostById({ id: Number(id) });
      return h
        .response({
          statusCode: 200,
          data: {
            message: 'Post deleted!',
          },
        })
        .code(200);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
