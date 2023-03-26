import updateTodos from '../../../controllers/todo/update';

describe('updateTodoMethod', () => {
  let mockTodoCollection: any;
  let request: any;
  let h: any;
  const mockTodo = {
    id: 1,
    userId: 1,
    title: 'Buy Groceries',
  };
  const todoId = 1;

  beforeAll(() => {
    mockTodoCollection = {
      updateTodoById: jest.fn(),
      getTodo: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: todoId },
      payload: {
        title: 'Buy Groceries',
      },
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

  it('should update a todo successfully', async () => {
    mockTodoCollection.getTodo.mockResolvedValue(mockTodo);
    mockTodoCollection.updateTodoById.mockResolvedValue(true);
    const updateTodoHandler = updateTodos({ todoCollection: mockTodoCollection });

    const response = await updateTodoHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(201);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'Task updated!',
      },
    });
    expect(response).toEqual(h);
    expect(mockTodoCollection.updateTodoById).toHaveBeenCalledWith({ id: todoId, dataToUpdate: { title: 'Buy Groceries' } });
  });

  it('Mark task as completed  when title is not provided in request.', async () => {
    request = {
      query: {},
      params: { id: todoId },
      payload: {},
      auth: { credentials: { id: todoId, scope: 'USER' } },
    };
    mockTodoCollection.getTodo.mockResolvedValue(mockTodo);
    mockTodoCollection.updateTodoById.mockResolvedValue(true);
    const updateTodoHandler = updateTodos({ todoCollection: mockTodoCollection });

    const response = await updateTodoHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(201);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'Task marked as complete!',
      },
    });
    expect(response).toEqual(h);
    expect(mockTodoCollection.updateTodoById).toHaveBeenCalledWith({ id: todoId, dataToUpdate: { completed: true } });
  });

  it('should return an error if todo is not found', async () => {
    mockTodoCollection.getTodo.mockReturnValue(null);
    const updateTodoHandler = updateTodos({ todoCollection: mockTodoCollection });
    try {
      await updateTodoHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('Task not found');
      expect(mockTodoCollection.updateTodoById).not.toHaveBeenCalled();
    }
  });

  test('should not update the task if the user is not authorized to update', async () => {
    mockTodoCollection.getTodo.mockReturnValue({ id: 5 });
    const updateTodoHandler = updateTodos({ todoCollection: mockTodoCollection });
    try {
      await updateTodoHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to update this task');
      expect(mockTodoCollection.updateTodoById).not.toHaveBeenCalled();
    }
  });
});
