import { ITodoController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';

export default ({ todoCollection }: ITodoController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.params;
      const { id: userId } = request.auth.credentials as any;
      const task = await todoCollection.getTodo({ id: Number(id) });
      if (!task) {
        throw generateCustomError('Task not found', 404);
      }
      if (task.userId !== userId) {
        throw generateCustomError('You are not authorized to delete this task', 401);
      }

      await todoCollection.deleteTaskById({ id: Number(id) });
      return h
        .response({
          statusCode: 200,
          data: {
            message: 'Task deleted!',
          },
        })
        .code(200);
    } catch (error) {
      throw wrapError(error);
    }
  };
};
