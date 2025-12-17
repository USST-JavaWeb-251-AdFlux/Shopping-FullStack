import bcrypt from 'bcrypt';
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

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [rows] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return { message: 'User registered successfully', userId: (rows as any).insertId };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username already exists',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
