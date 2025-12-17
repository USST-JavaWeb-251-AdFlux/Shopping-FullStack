import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '~/server/utils/db';

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

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '24h',
  });

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return { message: 'Login successful', user: { id: user.id, username: user.username } };
});
