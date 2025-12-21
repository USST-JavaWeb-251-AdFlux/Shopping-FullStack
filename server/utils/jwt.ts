import jwt, { JwtPayload } from 'jsonwebtoken';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

export const signUserToken = (user: { id: number; username: string }) => {
  return jwt.sign({ id: user.id, username: user.username }, getSecret(), {
    expiresIn: '24h',
  });
};

export const verifyUserToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, getSecret());
};
