import { handlerMethod } from '../types';
import {
  AccessTokenPayload,
  AccessTokenUserPayload,
  decode,
  generateAccessToken,
  generateCustomError,
  RefreshTokenPayload,
  wrapError,
} from '../../utils';
import { ON_ACCESS_TOKEN_REFRESHED } from '../../common';

export default (): handlerMethod => {
  return async (request, h) => {
    try {
      const { expiredToken } = request.payload as any;
      const refreshTokenPayload = decode(request.state['x-refresh-token']) as RefreshTokenPayload;
      const refreshTokenState = await request.server.methods.getRefreshTokenFromBucket(refreshTokenPayload.jti);

      // if the refresh token exists and it's active
      if (refreshTokenState?.isActive) {
        const oldAccessTokenPayload = decode(expiredToken, {
          ignoreExpiry: true,
        }) as AccessTokenPayload;

        if (oldAccessTokenPayload.refreshTokenId == refreshTokenPayload.jti) {
          const newAccessTokenUser: AccessTokenUserPayload = {
            _id: oldAccessTokenPayload._id,
            id: oldAccessTokenPayload.id,
            scope: oldAccessTokenPayload.scope,
            email: oldAccessTokenPayload.email,
            username: oldAccessTokenPayload.username,
          };
          // generate a new access token
          const newAccessToken = generateAccessToken(newAccessTokenUser, refreshTokenPayload.jti);
          if (newAccessToken) {
            await request.server.events.emit(ON_ACCESS_TOKEN_REFRESHED, newAccessToken);
            return {
              accessToken: newAccessToken.value,
            };
          }
        }
      }
      throw generateCustomError('Invalid token', 400);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
