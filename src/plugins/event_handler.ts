import { Server } from '@hapi/hapi';
import * as constants from '../common';
import { addAccessTokenToBucket, addTokensToBucket, dropRefreshTokenFromBucket, FreshToken, FreshTokensWithUser } from '../utils';

export default {
  name: 'EventHandlerPlugin',
  register: async function (server: Server) {
    server.event(constants.ON_LOGIN_SUCCESSFUL);
    server.event(constants.ON_LOGIN_FAILED);
    server.event(constants.ON_LOGOUT);
    server.event(constants.ON_ACCESS_TOKEN_REFRESHED);

    // @ts-ignore
    server.events.on(constants.ON_LOGIN_SUCCESSFUL, async (payload: FreshTokensWithUser) => {
      try {
        await addTokensToBucket(server, payload);
      } catch (e) {
        console.error(e);
      }
    });

    // @ts-ignore
    server.events.on(constants.ON_LOGOUT, async (payload: FreshToken) => {
      try {
        await dropRefreshTokenFromBucket(server, payload.jti);
      } catch (e) {
        console.error(e);
      }
    });

    // @ts-ignore
    server.events.on(constants.ON_ACCESS_TOKEN_REFRESHED, async (payload: FreshToken) => {
      try {
        await addAccessTokenToBucket(server, payload);
      } catch (e) {
        console.error(e);
      }
    });
  },
};
