import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    return { user: decoded };
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }
});
