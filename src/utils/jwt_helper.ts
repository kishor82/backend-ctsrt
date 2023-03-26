import jwt from 'jsonwebtoken';
import ms from 'ms';
import { v4 as uuidV4 } from 'uuid';
import { Request, Server } from '@hapi/hapi';
import config from '../config';
import { Role } from '../models/user_model';
import { generateCustomError } from '.';

const { jwt_secret_key } = config;

export type FreshToken = {
  value: string;
  jti: string;
};

export type FreshTokens = {
  accessToken: FreshToken;
  refreshToken: FreshToken;
};

export type FreshTokensWithUser = FreshTokens & {
  userId: number;
};

export interface AccessTokenUserPayload {
  scope: Role;
  username: string;
  email: string;
  _id: string;
  id: number;
}

export type TokenType = 'access' | 'refresh';

export type RegisterdClaims = {
  iat: number;
  exp: number;
  aud: [string];
  iss: string;
  jti: string;
};

export type TokenPayload = Partial<RegisterdClaims> & {
  tokenType: TokenType;
};

export type AccessTokenPayload = TokenPayload &
  AccessTokenUserPayload & {
    refreshTokenId: string;
  };

export type RefreshTokenPayload = TokenPayload & {
  userId: number;
};

export const generateAccessToken = (payload: AccessTokenUserPayload, refreshTokenId: string) => {
  const tokenId = uuidV4();

  const accessTokenPayload: AccessTokenPayload = {
    ...payload,
    tokenType: 'access',
    refreshTokenId,
  };

  const accessToken = jwt.sign(accessTokenPayload, jwt_secret_key, {
    expiresIn: String(getAccessTokenExpiryDuration()),
    jwtid: tokenId,
  });

  return {
    value: accessToken,
    jti: tokenId,
  };
};

export const generateRefreshToken = (payload: AccessTokenUserPayload): FreshToken => {
  const refreshTokenPayload: RefreshTokenPayload = {
    userId: payload.id,
    tokenType: 'refresh',
  };

  const jti = uuidV4();
  const refreshToken = jwt.sign(refreshTokenPayload, jwt_secret_key, {
    expiresIn: String(getRefreshExpiryDuration()),
    jwtid: jti,
  });

  return {
    jti,
    value: refreshToken,
  };
};

const getRefreshExpiryDuration = (): number => {
  // 1 week
  return ms('168h');
};

const getAccessTokenExpiryDuration = (): number => {
  return ms('15min');
};

export const getExpiryDuration = (tokenType: 'access_token' | 'refresh_token') => {
  if (tokenType === 'access_token') return getAccessTokenExpiryDuration();
  return getRefreshExpiryDuration();
};

export const generateTokens = (payload: AccessTokenUserPayload): FreshTokens => {
  const refreshToken = generateRefreshToken(payload);
  const accessToken = generateAccessToken(payload, refreshToken.jti);

  return {
    accessToken,
    refreshToken,
  };
};

export const validateToken = async (decoded: AccessTokenPayload, request: Request): Promise<{ isValid: boolean }> => {
  if (!decoded) {
    return { isValid: false };
  }

  switch (decoded.tokenType) {
    case 'access':
      if (decoded.jti && decoded.refreshTokenId) {
        // Look for this token in its cache bucket
        const refreshTokenState = await request.server.methods.getRefreshTokenFromBucket(decoded.refreshTokenId);
        const accessTokenState = await request.server.methods.getAccessTokenFromBucket(decoded.jti);

        if (refreshTokenState && accessTokenState) {
          // if token has been revoked, tokenStatus.isActive = false
          return {
            isValid: refreshTokenState.isActive && accessTokenState.isActive,
          };
        }
      }
      return {
        isValid: false,
      };
    case 'refresh':
      const refreshTokenStatus = await request.server.methods.getRefreshTokenFromBucket(decoded.jti);

      return { isValid: Boolean(refreshTokenStatus) };
    default:
      return {
        isValid: false,
      };
  }
};

export const addAccessTokenToBucket = async (server: Server, accessToken: FreshToken) => {
  await server.methods.addAccessTokenToBucket({
    jwtId: accessToken.jti,
  });
};

export const addRefreshTokenToBucket = async (server: Server, refreshToken: FreshToken) => {
  server.methods.addRefreshTokenToBucket({
    jti: refreshToken.jti,
  });
};

export const addTokensToBucket = async (server: Server, tokens: FreshTokensWithUser) => {
  await addAccessTokenToBucket(server, tokens.accessToken);
  await addRefreshTokenToBucket(server, tokens.refreshToken);

  server.methods.setLoggedInUserToBucket({
    userId: tokens.userId,
    refreshTokenId: tokens.refreshToken.jti,
  });
};

export const dropRefreshTokenFromBucket = async (server: Server, jti: string) => {
  server.methods.dropRefreshTokenFromBucket({ jti });
};

export const getRefreshTokenIdsForUser = (server: Server, userId: number) => {
  return server.methods.getRefreshTokensForUser(userId);
};

export const validate = (
  token: string,
  options?: {
    ignoreExpiry: boolean;
    tokenType?: TokenType;
  }
) => {
  return jwt.verify(
    token,
    jwt_secret_key,
    {
      ignoreExpiration: options?.ignoreExpiry,
    },
    function (err, decoded) {
      if (err) {
        throw new Error('invalid access token');
      }

      if (decoded != undefined) {
        if (options?.tokenType && (decoded as AccessTokenPayload).tokenType !== options.tokenType) {
          throw new Error('Invalid access token');
        }
        return token;
      }

      throw new Error('Could not decode that token');
    }
  );
};

export const decode = (token: string, options?: { ignoreExpiry: boolean }): unknown => {
  try {
    return jwt.verify(token, jwt_secret_key, {
      ignoreExpiration: options?.ignoreExpiry,
    });
  } catch (error) {
    if ((error as any)?.name === 'JsonWebTokenError') {
      throw generateCustomError((error as any)?.message, 400);
    }
  }
};
