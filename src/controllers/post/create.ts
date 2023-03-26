import { IPostController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { IPost } from '../../models/post_model';

export default ({ postCollection }: IPostController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.auth.credentials as any;
      const { title, body } = request.payload as IPost;
      const res = await postCollection.createPost({ title, body, userId: id });
      if (res) {
        return h
          .response({
            statusCode: 201,
            data: {
              message: 'Post created successfully!',
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
