import refreshSession from '../../../controllers/auth/refresh_session';
import { ON_ACCESS_TOKEN_REFRESHED } from '../../../common';
import { decode, generateAccessToken } from '../../../utils';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  decode: jest.fn(),
  generateAccessToken: jest.fn(),
}));
describe('refreshSession', () => {
  let request: any;
  let h: any;
  let server: any;

  const expiredToken = 'old access token';
  const refreshTokenPayload = { jti: 'refresh token id' };
  const oldAccessTokenPayload = {
    _id: 'user id',
    id: 'user id',
    scope: 'user scope',
    email: 'user@example.com',
    username: 'username',
    refreshTokenId: refreshTokenPayload.jti,
  };
  const newAccessToken = 'new access token';
  const expectedResponse = {
    accessToken: newAccessToken,
  };

  // Mock the necessary functions for this test case
  const getRefreshTokenFromBucket = jest.fn().mockResolvedValue({ isActive: true });
  const emitEvent = jest.fn();

  beforeEach(() => {
    server = {
      events: { emit: emitEvent },
      methods: {
        getRefreshTokenFromBucket,
      },
    };
    request = { payload: { expiredToken }, server };
    request.state = { 'x-refresh-token': 'refresh token cookie value' };
    h = { state: jest.fn() };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return a new access token if the refresh token is valid and the old access token is associated with it', async () => {
    (decode as jest.Mock).mockReturnValueOnce(refreshTokenPayload).mockReturnValueOnce(oldAccessTokenPayload);
    (generateAccessToken as jest.Mock).mockReturnValue({ value: newAccessToken });
    const response = await refreshSession()(request, h);
    expect(response).toEqual(expectedResponse);
    expect(getRefreshTokenFromBucket).toHaveBeenCalledWith(refreshTokenPayload.jti);
    expect(decode).toHaveBeenCalledWith(request.state['x-refresh-token']);
    expect(decode).toHaveBeenCalledWith(expiredToken, { ignoreExpiry: true });
    expect(generateAccessToken).toHaveBeenCalledWith(
      {
        _id: oldAccessTokenPayload._id,
        id: oldAccessTokenPayload.id,
        scope: oldAccessTokenPayload.scope,
        email: oldAccessTokenPayload.email,
        username: oldAccessTokenPayload.username,
      },
      refreshTokenPayload.jti
    );
    expect(emitEvent).toHaveBeenCalledWith(ON_ACCESS_TOKEN_REFRESHED, { value: newAccessToken });
  });

  it('should throw an error if the refresh token is invalid', async () => {
    (decode as jest.Mock).mockReturnValueOnce(refreshTokenPayload);
    getRefreshTokenFromBucket.mockResolvedValue(null);
    const expectedError = new Error('Invalid token');
    await expect(refreshSession()(request, h)).rejects.toThrow(expectedError);
  });
});
