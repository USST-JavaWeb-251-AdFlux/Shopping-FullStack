import pool from '~/server/utils/db';
import { getUserFromEvent } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  const userId = user.id;

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
