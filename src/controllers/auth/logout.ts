import { handlerMethod } from '../types';
import { dropRefreshTokenFromBucket, getRefreshTokenIdsForUser, wrapError } from '../../utils';

export default (): handlerMethod => {
  return async (request, h) => {
    try {
      const { id: userId } = request.auth.credentials as any;
      const refreshTokenState = await getRefreshTokenIdsForUser(request.server, userId);
      for (const token of refreshTokenState.tokens) {
        await dropRefreshTokenFromBucket(request.server, token);
      }
      return {
        statusCode: 200,
        data: 'Ok',
      };
    } catch (error) {
      throw wrapError(error);
    }
  };
};
