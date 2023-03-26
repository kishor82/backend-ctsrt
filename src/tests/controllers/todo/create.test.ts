import addNewTodo from '../../../controllers/todo/create';
import { generateCustomError, wrapError } from '../../../utils';

describe('addNewTodo', () => {
  let mockTodoCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockTodoCollection = {
      addNewTodo: jest.fn().mockReturnValue(true),
    };
  });

  beforeEach(() => {
    request = { auth: { credentials: { id: 1 } }, payload: { title: 'Buy Groceries' } };
    h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return a 201 status code with a success message if the todo is added successfully', async () => {
    const response: any = await addNewTodo({ todoCollection: mockTodoCollection })(request, h);
    expect(mockTodoCollection.addNewTodo).toHaveBeenCalledWith({ title: 'Buy Groceries', userId: 1 });
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'Task created successfully!',
      },
    });
    expect(h.response().code).toHaveBeenCalledWith(201);
    expect(response).toEqual(h);
  });

  it('should throw an error if the todo cannot be added', async () => {
    mockTodoCollection.addNewTodo.mockReturnValueOnce(false);

    await expect(addNewTodo({ todoCollection: mockTodoCollection })(request, h)).rejects.toThrow(generateCustomError('Invalid input data.', 400));
  });

  it('should throw an error if an exception is thrown', async () => {
    mockTodoCollection.addNewTodo.mockRejectedValueOnce(new Error('Database connection error'));

    await expect(addNewTodo({ todoCollection: mockTodoCollection })(request, h)).rejects.toThrow(wrapError(new Error('Database connection error')));
  });
});
