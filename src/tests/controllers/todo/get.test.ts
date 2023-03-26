import getTodos from '../../../controllers/todo/get';

describe('getTodoMethod', () => {
  let mockTodoCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockTodoCollection = {
      getTodo: jest.fn(),
      getAllTodos: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      params: {
        id: 1,
      },
      query: {},
      auth: { credentials: { id: 1 } },
    };
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getTodo', () => {
    it('should return the Todo with the given ID', async () => {
      const mockTodo = { id: 1, completed: false, userId: 1, TodoId: 1 };
      mockTodoCollection.getTodo.mockResolvedValue(mockTodo);

      const result = await getTodos({ todoCollection: mockTodoCollection })(request, h);

      expect(mockTodoCollection.getTodo).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockTodo);
    });

    it('should throw an error if the ID is not a number', async () => {
      await expect(getTodos(mockTodoCollection)(request, h)).rejects.toThrowError();
    });
  });

  describe('getAllTodos', () => {
    it('should return all Todos', async () => {
      const mockTodos = [
        { id: 1, completed: false, userId: 1, titile: 'title-1' },
        { id: 2, completed: false, userId: 2, titile: 'title-2' },
        { id: 3, completed: false, userId: 3, titile: 'title-3' },
      ];

      request = {
        params: {},
        query: {},
        auth: { credentials: { id: 1 } },
      };
      mockTodoCollection.getAllTodos.mockResolvedValue(mockTodos);

      const result = await getTodos({ todoCollection: mockTodoCollection })(request, h);

      expect(mockTodoCollection.getAllTodos).toHaveBeenCalledWith({ keyword: undefined, pageNumber: undefined, pageSize: undefined });
      expect(result).toEqual(mockTodos);
    });

    it('should return Todos matching the given keyword', async () => {
      const mockTodos = [
        { id: 1, completed: false, userId: 1, titile: 'title-1' },
        { id: 2, completed: false, userId: 2, titile: 'title-2' },
      ];
      const pageNumber = 1;
      const pageSize = 5;
      request = { params: {}, query: { keyword: 'test', pageNumber, pageSize }, auth: { credentials: { id: 1 } } };

      mockTodoCollection.getAllTodos.mockResolvedValue([
        {
          metadata: [
            {
              total: 2,
              pageNumber,
              pageSize,
            },
          ],
          data: mockTodos,
        },
      ]);

      const result: any = await getTodos({ todoCollection: mockTodoCollection })(request, h);

      expect(mockTodoCollection.getAllTodos).toHaveBeenCalledWith({ keyword: 'test', pageNumber, pageSize });
      expect(result[0].data).toEqual(mockTodos);
    });

    it('should throw an error if getAllTodos() throws an error', async () => {
      const mockError = new Error('Error getting Todos.');
      request = {
        params: {},
        query: { pageNumber: 2, pageSize: 10, keyword: 'test' },
        auth: { credentials: { id: 1 } },
      };
      mockTodoCollection.getAllTodos.mockRejectedValue(mockError);

      await expect(getTodos({ todoCollection: mockTodoCollection })(request, h)).rejects.toThrow(mockError);
      expect(mockTodoCollection.getAllTodos).toHaveBeenCalledWith({
        keyword: 'test',
        pageNumber: 2,
        pageSize: 10,
      });
    });
  });
});
