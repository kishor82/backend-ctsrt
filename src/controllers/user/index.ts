import { userCollection } from '../../data_access';

import makeCreateAction from './create';
import makeGetAction from './get';
import makeUpdateAction from './update';
import makeDeleteAction from './delete';

export const createUserAction = makeCreateAction({ userCollection });
export const getUserAction = makeGetAction({ userCollection });
export const updateUserAction = makeUpdateAction({ userCollection });
export const deleteUserAction = makeDeleteAction({ userCollection });
