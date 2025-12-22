import pool from '~/server/utils/db';
import { getUserFromEvent } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  const userId = user.id;

  const body = await readBody(event);
  const { productId, quantity } = body;

  if (!productId || quantity === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID and quantity required' });
  }

  const parsedQuantity = Number(quantity);
  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Quantity must be a positive integer' });
  }

  try {
    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [parsedQuantity, userId, productId]
    );
    return { message: 'Cart updated' };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error updating cart' });
  }
});
