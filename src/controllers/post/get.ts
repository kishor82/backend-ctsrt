import { IPostController, handlerMethod } from '../types';
import { wrapError } from '../../utils';

export default ({ postCollection }: IPostController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { keyword, pageNumber, pageSize } = request.query;
      if (id) {
        return await postCollection.getPost({ id: Number(id) });
      } else {
        return await postCollection.getAllPosts({ keyword, pageNumber, pageSize });
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
