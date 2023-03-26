import { postCollection } from '../../data_access';
import makeCreateAction from './create';
import makeGetAction from './get';
import makeUpdateAction from './update';
import makeDeleteAction from './delete';

export const createPostAction = makeCreateAction({ postCollection });
export const getPostAction = makeGetAction({ postCollection });
export const updatePostAction = makeUpdateAction({ postCollection });
export const deletePostAction = makeDeleteAction({ postCollection });
