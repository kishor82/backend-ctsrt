import updateUsers from '../../../controllers/user/update';

describe('updateUserMethod', () => {
  let mockUserCollection: any;
  let request: any;
  let h: any;
  const mockUser = {
    id: 1,
    userId: 1,
    title: 'Buy Groceries',
  };
  const userId = 1;

  beforeAll(() => {
    mockUserCollection = {
      updateUserById: jest.fn(),
      getUserById: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: userId },
      payload: { name: 'Test User', email: 'test@test.com', username: 'testuser', password: 'test123' },
      auth: { credentials: { id: userId, scope: 'USER' } },
    };
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a user successfully', async () => {
    mockUserCollection.getUserById.mockResolvedValue(mockUser);
    mockUserCollection.updateUserById.mockResolvedValue(true);
    const updateUserHandler = updateUsers({ userCollection: mockUserCollection });

    const response = await updateUserHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(201);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'User updated!',
      },
    });
    expect(response).toEqual(h);
    expect(mockUserCollection.updateUserById).toHaveBeenCalledWith({
      id: userId,
      dataToUpdate: { email: 'test@test.com', name: 'Test User', password: 'test123', username: 'testuser' },
    });
  });

  it('should return an error if user is not found', async () => {
    mockUserCollection.getUserById.mockReturnValue(null);
    const updateUserHandler = updateUsers({ userCollection: mockUserCollection });
    try {
      await updateUserHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
      expect(mockUserCollection.updateUserById).not.toHaveBeenCalled();
    }
  });

  test('should not update the user if the user is not authorized to update', async () => {
    mockUserCollection.getUserById.mockReturnValue({ id: 5 });
    const updateUserHandler = updateUsers({ userCollection: mockUserCollection });
    try {
      await updateUserHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to update this user');
      expect(mockUserCollection.updateUserById).not.toHaveBeenCalled();
    }
  });
});
