import { userCollection } from '../../data_access';
import makeLoginAction from './login';
import makeLogoutAction from './logout';
import makeRefreshSessionAction from './refresh_session';

export const loginAction = makeLoginAction({ userCollection });
export const logoutAction = makeLogoutAction();
export const refreshSessionAction = makeRefreshSessionAction();
