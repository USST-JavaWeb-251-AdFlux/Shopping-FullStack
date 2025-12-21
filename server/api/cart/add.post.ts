import pool from '~/server/utils/db';
import { getUserFromEvent } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  const userId = user.id;

  const body = await readBody(event);
  const { productId, quantity } = body;

  if (!productId || !quantity) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID and quantity required' });
  }

  try {
    const [existing] = await pool.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if ((existing as any[]).length > 0) {
      await pool.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    return { message: 'Added to cart' };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error adding to cart' });
  }
});
