import createUser from '../../../controllers/user/create';
import { generateCustomError, wrapError } from '../../../utils';
import { IUser, Role } from '../../../models/user_model';
import { UserCollectionType, userCollection } from '../../../data_access';

describe('createUserMethod', () => {
  let mockUserCollection: UserCollectionType;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockUserCollection = {
      ...userCollection,
      getUserByEmail: jest.fn().mockReturnValue(null),
      createNewUser: jest.fn().mockReturnValue({
        _id: 1,
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        username: 'testuser',
        password: 'test123',
        role: Role.USER,
      } as Partial<IUser>),
    };
  });

  beforeEach(() => {
    request = { payload: { name: 'Test User', email: 'test@test.com', username: 'testuser', password: 'test123' } };
    h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    const response: any = await createUser({ userCollection: mockUserCollection })(request, h);

    expect(mockUserCollection.getUserByEmail).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(mockUserCollection.createNewUser).toHaveBeenCalledWith({ userData: request.payload });
    expect(h.response).toHaveBeenCalledWith({
      statusCode: 201,
      data: {
        message: 'User Created Successfully!',
      },
    });
    expect(h.code).toHaveBeenCalledWith(201);
    expect(response).toEqual(h);
  });

  it('should throw an error if the email is already taken', async () => {
    (mockUserCollection.getUserByEmail as jest.Mock).mockReturnValueOnce({
      _id: 2,
      id: 2,
      name: 'Another Test User',
      email: 'test@test.com',
      username: 'anothertestuser',
      password: 'test123',
      role: Role.USER,
    } as Partial<IUser>);

    await expect(createUser({ userCollection: mockUserCollection })(request, h)).rejects.toThrow(
      generateCustomError('User with the provided email already exists.', 409)
    );
  });

  it('should throw an error if an exception is thrown', async () => {
    (mockUserCollection.createNewUser as jest.Mock).mockRejectedValueOnce(new Error('Database connection error'));
    await expect(createUser({ userCollection: mockUserCollection })(request, h)).rejects.toThrow(wrapError(new Error('Database connection error')));
  });
});
