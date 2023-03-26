import getUsers from '../../../controllers/user/get';

describe('getUserMethod', () => {
  let mockUserCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockUserCollection = {
      getUserById: jest.fn(),
      getAllUsers: jest.fn(),
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

  describe('getUser', () => {
    it('should return the User with the given ID', async () => {
      const mockUser = { id: 1, completed: false, userId: 1, UserId: 1 };
      mockUserCollection.getUserById.mockResolvedValue(mockUser);

      const result = await getUsers({ userCollection: mockUserCollection })(request, h);

      expect(mockUserCollection.getUserById).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if the ID is not a number', async () => {
      await expect(getUsers(mockUserCollection)(request, h)).rejects.toThrowError();
    });
  });

  describe('getAllUsers', () => {
    it('should return all Users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe123',
          email: 'johndoe123@example.com',
          password: 's3cr3tp@ssword',
          role: 'ADMIN',
        },
        {
          id: 2,
          name: 'Jane Smith',
          username: 'janesmith456',
          email: 'janesmith456@example.com',
          password: 's3cur3p@ss',
          role: 'USER',
        },
        {
          id: 3,
          name: 'Bob Johnson',
          username: 'bob_j',
          email: 'bjohnson@example.com',
          password: 'myp@ssw0rd',
          role: 'USER',
        },
      ];

      request = {
        params: {},
        query: {},
        auth: { credentials: { id: 1 } },
      };
      mockUserCollection.getAllUsers.mockResolvedValue(mockUsers);

      const result = await getUsers({ userCollection: mockUserCollection })(request, h);

      expect(mockUserCollection.getAllUsers).toHaveBeenCalledWith({ keyword: undefined, pageNumber: undefined, pageSize: undefined });
      expect(result).toEqual(mockUsers);
    });

    it('should return Users matching the given keyword', async () => {
      const mockUsers = [
        {
          id: 4,
          name: 'Alice Kim',
          username: 'alice_kim',
          email: 'alicekim@example.com',
          password: 't3stp@ssword',
          role: 'USER',
        },
      ];
      const pageNumber = 1;
      const pageSize = 5;
      request = { params: {}, query: { keyword: 'Alice', pageNumber, pageSize }, auth: { credentials: { id: 1 } } };

      mockUserCollection.getAllUsers.mockResolvedValue([
        {
          metadata: [
            {
              total: 2,
              pageNumber,
              pageSize,
            },
          ],
          data: mockUsers,
        },
      ]);

      const result: any = await getUsers({ userCollection: mockUserCollection })(request, h);

      expect(mockUserCollection.getAllUsers).toHaveBeenCalledWith({ keyword: 'Alice', pageNumber, pageSize });
      expect(result[0].data).toEqual(mockUsers);
    });

    it('should throw an error if getAllUsers() throws an error', async () => {
      const mockError = new Error('Error getting Users.');
      request = {
        params: {},
        query: { pageNumber: 2, pageSize: 10, keyword: 'test' },
        auth: { credentials: { id: 1 } },
      };
      mockUserCollection.getAllUsers.mockRejectedValue(mockError);

      await expect(getUsers({ userCollection: mockUserCollection })(request, h)).rejects.toThrow(mockError);
      expect(mockUserCollection.getAllUsers).toHaveBeenCalledWith({
        keyword: 'test',
        pageNumber: 2,
        pageSize: 10,
      });
    });
  });
});
