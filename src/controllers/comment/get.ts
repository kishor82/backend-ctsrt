import { ICommentController, handlerMethod } from '../types';
import { wrapError } from '../../utils';

export default ({ commentCollection }: ICommentController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { keyword, pageNumber, pageSize } = request.query;
      if (id) {
        return await commentCollection.getComment({ id: Number(id) });
      } else {
        return await commentCollection.getAllComments({ keyword, pageNumber, pageSize });
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
