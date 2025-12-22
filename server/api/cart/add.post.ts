import pool from '~/server/utils/db';
import { getUserFromEvent } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  const userId = user.id;

  const body = await readBody(event);
  const { productId, quantity } = body;

  if (productId === undefined || productId === null || quantity === undefined || quantity === null) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID and quantity required' });
  }

  const productIdNum = Number(productId);
  const quantityNum = Number(quantity);

  if (
    !Number.isInteger(productIdNum) ||
    productIdNum <= 0 ||
    !Number.isInteger(quantityNum) ||
    quantityNum <= 0
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID and quantity must be positive integers' });
  }

  try {
    const [existing] = await pool.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productIdNum]
    );

    if ((existing as any[]).length > 0) {
      await pool.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantityNum, userId, productIdNum]
      );
    } else {
      await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productIdNum, quantityNum]
      );
    }

    return { message: 'Added to cart' };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error adding to cart' });
  }
});
