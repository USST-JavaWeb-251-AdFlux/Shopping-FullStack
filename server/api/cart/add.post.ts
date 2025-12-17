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

  if (!productId || !quantity) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID and quantity required' });
  }

  try {
    // Check if item exists in cart
    const [existing] = await pool.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if ((existing as any[]).length > 0) {
      // Update quantity
      await pool.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      // Insert new item
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
