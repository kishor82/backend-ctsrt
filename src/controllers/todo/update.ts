import { ITodoController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { ITodo } from '../../models/todo_model';

export default ({ todoCollection }: ITodoController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { title } = request.payload as ITodo;
      const { id: userId } = request.auth.credentials as any;
      const task = await todoCollection.getTodo({ id: Number(id) });
      if (!task) {
        throw generateCustomError('Task not found', 404);
      }
      if (task.userId !== userId) {
        throw generateCustomError('You are not authorized to update this task', 401);
      }
      if (title) {
        await todoCollection.updateTodoById({ id: Number(id), dataToUpdate: { title } });
        return h
          .response({
            statusCode: 201,
            data: {
              message: 'Task updated!',
            },
          })
          .code(201);
      } else {
        await todoCollection.updateTodoById({ id: Number(id), dataToUpdate: { completed: true } });
        return h
          .response({
            statusCode: 201,
            data: {
              message: 'Task marked as complete!',
            },
          })
          .code(201);
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
