import { logoutAction } from '../../controllers';
import { API_ROUTE_USER_LOGOUT } from '../../common/api_constants';
import { Server } from '@hapi/hapi';

export const logoutRoute = (server: Server) => {
  server.route({
    method: 'POST',
    path: `${API_ROUTE_USER_LOGOUT}`,
    options: {
      description: 'User Logout.',
      tags: ['api'],
      handler: logoutAction,
    },
  });
};
