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
  const { productId, quantity } = body;

  if (!productId || quantity === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID and quantity required' });
  }

  try {
    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    return { message: 'Cart updated' };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error updating cart' });
  }
});
