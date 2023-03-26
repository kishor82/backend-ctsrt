import logout from '../../../controllers/auth/logout';
import { dropRefreshTokenFromBucket, getRefreshTokenIdsForUser } from '../../../utils';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  dropRefreshTokenFromBucket: jest.fn(),
  getRefreshTokenIdsForUser: jest.fn(),
}));

describe('logout handler', () => {
  let request: any;
  let h: any;
  let server: any;
  const credentials = { id: 'some-user-id' }; //

  beforeEach(() => {
    server: {}
    request = { auth: { credentials } };
    h = { state: jest.fn() };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should drop refresh tokens for user and return status code 200', async () => {
    const refreshTokenState = { tokens: ['token1', 'token2'] }; // mock refresh token state
    (getRefreshTokenIdsForUser as jest.Mock).mockResolvedValue(refreshTokenState); // mock getRefreshTokenIdsForUser to return refreshTokenState
    const result = await logout()(request, h); // call refreshTokenHandler
    expect(getRefreshTokenIdsForUser).toHaveBeenCalledWith(server, credentials.id); // check if getRefreshTokenIdsForUser was called with the correct arguments
    expect(dropRefreshTokenFromBucket).toHaveBeenCalledTimes(2); // check if dropRefreshTokenFromBucket was called twice
    expect(dropRefreshTokenFromBucket).toHaveBeenNthCalledWith(1, server, refreshTokenState.tokens[0]); // check if dropRefreshTokenFromBucket was called with the correct arguments for token1
    expect(dropRefreshTokenFromBucket).toHaveBeenNthCalledWith(2, server, refreshTokenState.tokens[1]); // check if dropRefreshTokenFromBucket was called with the correct arguments for token2
    expect(result).toEqual({ statusCode: 200, data: 'Ok' }); // check if the function returned the expected value
  });

  it('should throw error when dropping refresh tokens fails', async () => {
    const error = new Error('Invalid token'); // mock error
    (getRefreshTokenIdsForUser as jest.Mock).mockRejectedValue(error); // mock getRefreshTokenIdsForUser to throw error

    await expect(logout()(request, h)).rejects.toThrow(error); // call refreshTokenHandler and expect it to throw the error thrown by wrapError
  });
});
