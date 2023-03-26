import { ITodoController, handlerMethod } from '../types';
import { generateCustomError, wrapError } from '../../utils';
import { ITodo } from '../../models/todo_model';

export default ({ todoCollection }: ITodoController): handlerMethod => {
  return async (request, h) => {
    try {
      const { id } = request.auth.credentials as any;
      const { title } = request.payload as ITodo;
      const res = await todoCollection.addNewTodo({ title, userId: id });
      if (res) {
        return h
          .response({
            statusCode: 201,
            data: {
              message: 'Task created successfully!',
            },
          })
          .code(201);
      } else {
        throw generateCustomError('Invalid input data.', 400);
      }
    } catch (error) {
      throw wrapError(error);
    }
  };
};
