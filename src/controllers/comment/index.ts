import { commentCollection } from '../../data_access';
import makeCreateAction from './create';
import makeGetAction from './get';
import makeUpdateAction from './update';
import makeDeleteAction from './delete';

export const createCommentAction = makeCreateAction({ commentCollection });
export const getCommentAction = makeGetAction({ commentCollection });
export const updateCommentAction = makeUpdateAction({ commentCollection });
export const deleteCommentAction = makeDeleteAction({ commentCollection });
