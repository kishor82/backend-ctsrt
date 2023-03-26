import { todoCollection } from '../../data_access';
import makeCreateAction from './create';
import makeGetAction from './get';
import makeUpdateAction from './update';
import makeDeleteAction from './delete';

export const createTodoAction = makeCreateAction({ todoCollection });
export const getTodoAction = makeGetAction({ todoCollection });
export const updateTodoAction = makeUpdateAction({ todoCollection });
export const deleteTodoAction = makeDeleteAction({ todoCollection });
