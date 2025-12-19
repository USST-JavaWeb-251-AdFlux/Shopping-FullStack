import jwt from 'jsonwebtoken';
import pool from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey') as any;
    userId = decoded.id;
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }

  const body = await readBody(event);
  const { productId } = body || {};

  if (
    productId === undefined ||
    productId === null ||
    typeof productId !== 'number' ||
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid productId' });
  }
  try {
    await pool.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return { message: 'Removed from cart' };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error removing from cart' });
  }
});
