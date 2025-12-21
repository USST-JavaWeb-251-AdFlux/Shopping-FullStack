import { H3Event } from 'h3';
import { verifyUserToken } from '~/server/utils/jwt';

export const getUserFromEvent = (event: H3Event) => {
  const token = getCookie(event, 'auth_token');
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  try {
    const decoded = verifyUserToken(token);
    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }
    return decoded as { id: number; username: string };
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
};