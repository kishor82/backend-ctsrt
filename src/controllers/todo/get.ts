import { ITodoController, handlerMethod } from '../types';
import { wrapError } from '../../utils';

export default ({ todoCollection }: ITodoController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { keyword, pageNumber, pageSize } = request.query;
      if (id) {
        return await todoCollection.getTodo({ id: Number(id) });
      } else {
        return await todoCollection.getAllTodos({ keyword, pageNumber, pageSize });
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
