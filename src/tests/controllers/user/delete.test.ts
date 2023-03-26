import deleteUsers from '../../../controllers/user/delete';

describe('deleteUserMethod', () => {
  let mockUserCollection: any;
  let request: any;
  let h: any;
  const userId = 1;

  beforeAll(() => {
    mockUserCollection = {
      deleteUserById: jest.fn(),
      getUserById: jest.fn(),
    };
  });

  beforeEach(() => {
    request = {
      query: {},
      params: { id: userId },
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

  it('should delete a user successfully', async () => {
    mockUserCollection.getUserById.mockResolvedValue({ id: userId });
    mockUserCollection.deleteUserById.mockResolvedValue(true);
    const deleteUserHandler = deleteUsers({ userCollection: mockUserCollection });

    const response = await deleteUserHandler(request, h);

    expect(h.code).toHaveBeenCalledWith(200);
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 200,
      data: {
        message: 'User deleted!',
      },
    });
    expect(response).toEqual(h);
    expect(mockUserCollection.deleteUserById).toHaveBeenCalledWith({ id: userId });
  });

  it('should return an error if user is not found', async () => {
    mockUserCollection.getUserById.mockReturnValue(null);
    const deleteUserHandler = deleteUsers({ userCollection: mockUserCollection });
    try {
      await deleteUserHandler(request, h);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
      expect(mockUserCollection.deleteUserById).not.toHaveBeenCalled();
    }
  });

  test('should not delete the user if the user is not authorized to delete', async () => {
    mockUserCollection.getUserById.mockReturnValue({ id: 5 });
    const deleteUserHandler = deleteUsers({ userCollection: mockUserCollection });
    try {
      await deleteUserHandler(request, h);
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error.output.statusCode).toBe(401);
      expect(error.message).toBe('You are not authorized to delete this user');
      expect(mockUserCollection.deleteUserById).not.toHaveBeenCalled();
    }
  });
});
