import { handlerMethod, ILoginController } from '../types';
import { generateCustomError, wrapError, generateTokens, getExpiryDuration } from '../../utils';
import { IUser } from '../../models/user_model';
import { API_ROUTE_REFRESH_SESSION, ON_LOGIN_SUCCESSFUL } from '../../common';

export default ({ userCollection }: ILoginController): handlerMethod => {
  return async (request, h) => {
    try {
      const { email, password } = request.payload as IUser;
      const user = await userCollection.getUserByEmail({ email });
      if (user && (await user.matchPassword(password))) {
        const { _id, email, username, id, role } = user;
        const { accessToken, refreshToken } = generateTokens({
          scope: role,
          id,
          username,
          email,
          _id,
        });

        await request.server.events.emit(ON_LOGIN_SUCCESSFUL, {
          accessToken,
          refreshToken,
          userId: id,
        });

        h.state('x-refresh-token', refreshToken.value, {
          path: API_ROUTE_REFRESH_SESSION,
          ttl: getExpiryDuration('refresh_token'),
          isSecure: false,
        });

        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value,
            refreshToken: refreshToken.value,
          },
        };
      } else {
        throw generateCustomError('Invalid email or password. Please try again.', 401);
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
