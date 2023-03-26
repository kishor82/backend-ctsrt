import { IUserController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { IUser } from '../../models/user_model';

export default ({ userCollection }: IUserController): handlerMethod => {
  return async (request, h) => {
    try {
      const { email } = request.payload as IUser;
      const userExists = await userCollection.getUserByEmail({ email });

      if (userExists) {
        throw generateCustomError('User with the provided email already exists.', 409);
      }

      await userCollection.createNewUser({ userData: request.payload });

      return h
        .response({
          statusCode: 201,
          data: {
            message: 'User Created Successfully!',
          },
        })
        .code(201);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
