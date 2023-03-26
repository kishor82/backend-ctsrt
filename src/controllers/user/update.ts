import { IUserController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { IUser } from '../../models/user_model';

export default ({ userCollection }: IUserController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const userData = request.payload as IUser;
      const { id: userId, scope } = request.auth.credentials as any;
      const user = await userCollection.getUserById({ id: Number(id) });
      if (!user) {
        throw generateCustomError('User not found', 404);
      }
      if (user.id !== userId && scope !== 'admin') {
        throw generateCustomError('You are not authorized to update this user', 401);
      }
      await userCollection.updateUserById({ id: Number(id), dataToUpdate: userData });
      return h
        .response({
          statusCode: 201,
          data: {
            message: 'User updated!',
          },
        })
        .code(201);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
