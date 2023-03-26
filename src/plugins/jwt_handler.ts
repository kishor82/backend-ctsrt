import hapiJwt from 'hapi-auth-jwt2';
import { Server } from '@hapi/hapi';
import { getExpiryDuration, validateToken } from '../utils';
import config from '../config';

export default {
  name: 'JwtHandler',
  version: '1.0.0',
  async register(server: Server) {
    const { jwt_secret_key } = config;
    // @ts-ignore
    await server.register(hapiJwt);

    const accessTokenCacheBucket = server.cache({
      expiresIn: getExpiryDuration('access_token'),
      segment: 'access_tokens',
    });

    const refreshTokenCacheBucket = server.cache({
      expiresIn: getExpiryDuration('refresh_token'),
      segment: 'refresh_tokens',
    });

    const usersCacheBucket = server.cache({
      expiresIn: getExpiryDuration('refresh_token'),
      segment: 'users',
    });

    // Add server method to allow calling from 'addTokenToBucket' from route
    server.method('addAccessTokenToBucket', async ({ jwtId }) => {
      await accessTokenCacheBucket.set(jwtId, { isActive: true }, getExpiryDuration('access_token'));
    });

    server.method('dropRefreshTokenFromBucket', async ({ jti }) => {
      await refreshTokenCacheBucket.drop(jti);
    });

    // Add server method to allow calling from 'getTokenFromBucket' from route
    server.method('getAccessTokenFromBucket', (jwtId) => accessTokenCacheBucket.get(jwtId));

    server.method('addRefreshTokenToBucket', async ({ jti }) => {
      await refreshTokenCacheBucket.set(jti, { isActive: true }, getExpiryDuration('refresh_token'));
    });

    server.method('getRefreshTokenFromBucket', (jwtId) => refreshTokenCacheBucket.get(jwtId));

    server.method('getRefreshTokensForUser', (userId) => usersCacheBucket.get(String(userId)));

    server.method('setLoggedInUserToBucket', ({ userId, refreshTokenId }) => {
      usersCacheBucket.set(String(userId), {
        tokens: [refreshTokenId],
      });
    });

    server.auth.strategy('jwt', 'jwt', {
      key: jwt_secret_key,
      validate: validateToken,
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });
    // require jwt for all routes
    server.auth.default('jwt');
  },
};
