import { IUserController, handlerMethod } from '../types';
import { wrapError } from '../../utils';

export default ({ userCollection }: IUserController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { keyword, pageNumber, pageSize } = request.query;
      const { id: userId } = request.auth.credentials as any;
      if (id) {
        return await userCollection.getUserById({ id: Number(id) });
      } else {
        return await userCollection.getAllUsers({ keyword, pageNumber, pageSize });
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
