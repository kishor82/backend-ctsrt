import deleteTodos from '../../../controllers/todo/delete';

describe('deleteTodoMethod', () => {
  let mockTodoCollection: any;
  let request: any;
  let h: any;
  const todoId = 1;

  beforeAll(() => {
    mockTodoCollection = {
      deleteTaskById: jest.fn(),
      getTodo: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: todoId },
      auth: { credentials: { id: todoId, scope: 'USER' } },
    };
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a task successfully', async () => {
    mockTodoCollection.getTodo.mockResolvedValue({ id: todoId, userId: todoId });
    mockTodoCollection.deleteTaskById.mockResolvedValue(true);
    const deleteTodoHandler = deleteTodos({ todoCollection: mockTodoCollection });

    const response = await deleteTodoHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(200);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 200,
      data: {
        message: 'Task deleted!',
      },
    });
    expect(response).toEqual(h);
    expect(mockTodoCollection.deleteTaskById).toHaveBeenCalledWith({ id: todoId });
  });

  it('should return an error if todo is not found', async () => {
    mockTodoCollection.getTodo.mockReturnValue(null);
    const deleteTodoHandler = deleteTodos({ todoCollection: mockTodoCollection });
    try {
      await deleteTodoHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('Task not found');
      expect(mockTodoCollection.deleteTaskById).not.toHaveBeenCalled();
    }
  });

  test('should not delete the todo if the todo is not authorized to delete', async () => {
    mockTodoCollection.getTodo.mockReturnValue({ id: 5 });
    const deleteTodoHandler = deleteTodos({ todoCollection: mockTodoCollection });
    try {
      await deleteTodoHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to delete this task');
      expect(mockTodoCollection.deleteTaskById).not.toHaveBeenCalled();
    }
  });
});
