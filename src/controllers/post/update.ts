import { IPostController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { IPost } from '../../models/post_model';

export default ({ postCollection }: IPostController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { title, body } = request.payload as IPost;
      const { id: userId } = request.auth.credentials as any;
      const post = await postCollection.getPost({ id: Number(id) });
      if (!post) {
        throw generateCustomError('Post not found', 404);
      }
      if (post.userId !== userId) {
        throw generateCustomError('You are not authorized to update this post', 401);
      }

      await postCollection.updatePostById({ id: Number(id), dataToUpdate: { title, body } });
      return h
        .response({
          statusCode: 201,
          data: {
            message: 'Post updated!',
          },
        })
        .code(201);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
