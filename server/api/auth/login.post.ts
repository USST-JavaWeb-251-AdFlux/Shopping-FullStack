import bcrypt from 'bcrypt';
import pool from '~/server/utils/db';
import { signUserToken } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required',
    });
  }

  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
  const users = rows as any[];

  if (users.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  const user = users[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  const token = signUserToken(user);

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return { message: 'Login successful', user: { id: user.id, username: user.username } };
});
