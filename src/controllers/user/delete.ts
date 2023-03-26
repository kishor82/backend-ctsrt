import { IUserController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';

export default ({ userCollection }: IUserController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { id: userId, scope } = request.auth.credentials as any;
      const user = await userCollection.getUserById({ id: Number(id) });

      if (!user) {
        throw generateCustomError('User not found', 404);
      }
      if (user.id !== userId && scope !== 'admin') {
        throw generateCustomError('You are not authorized to delete this user', 401);
      }

      await userCollection.deleteUserById({ id: Number(id) });
      return h
        .response({
          statusCode: 200,
          data: {
            message: 'User deleted!',
          },
        })
        .code(200);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
