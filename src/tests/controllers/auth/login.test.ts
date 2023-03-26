import login from '../../../controllers/auth/login';
import { generateCustomError, wrapError } from '../../../utils';

describe('loginMethod', () => {
  let mockUserCollection: any;
  let request: any;
  let h: any;

  beforeAll(() => {
    mockUserCollection = {
      getUserByEmail: jest.fn().mockReturnValue({
        _id: 1,
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        username: 'testuser',
        password: 'test123',
        role: 'user',
        matchPassword: jest.fn().mockReturnValue(true),
      }),
    };
  });

  beforeEach(() => {
    request = { payload: { email: 'test@test.com', password: 'test123' }, server: { events: { emit: jest.fn() } } };
    h = { state: jest.fn() };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return a token if the email and password match a user in the collection', async () => {
    // Mock the generateTokens and getExpiryDuration functions
    const response: any = await login({ userCollection: mockUserCollection })(request, h);

    expect(mockUserCollection.getUserByEmail).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(response.statusCode).toBe(200);
    expect(response.data.accessToken).toBeDefined();
    expect(response.data.refreshToken).toBeDefined();
    expect(request.server.events.emit).toHaveBeenCalledTimes(1);
    expect(h.state).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the email or password is incorrect', async () => {
    mockUserCollection.getUserByEmail.mockReturnValueOnce(null);

    await expect(login({ userCollection: mockUserCollection })(request, h)).rejects.toThrow(
      generateCustomError('Invalid email or password. Please try again.', 401)
    );
  });

  it('should throw an error if an exception is thrown', async () => {
    mockUserCollection.getUserByEmail.mockRejectedValueOnce(new Error('Database connection error'));
    const request: any = { payload: { email: 'test@test.com', password: 'test123' } };
    const h: any = {};

    await expect(login({ userCollection: mockUserCollection })(request, h)).rejects.toThrow(wrapError(new Error('Database connection error')));
  });
});
