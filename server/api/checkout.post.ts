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
  let items = body.items; // Array of { productId, quantity }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    if (!items || items.length === 0) {
      // Checkout from cart
      const [cartRows] = await connection.execute(
        'SELECT product_id as productId, quantity FROM cart_items WHERE user_id = ?',
        [userId]
      );
      items = cartRows as any[];

      if (items.length === 0) {
        throw new Error('Cart is empty');
      }
    }

    // Process items
    for (const item of items) {
      const [productRows] = await connection.execute(
        'SELECT quantity FROM products WHERE id = ? FOR UPDATE',
        [item.productId]
      );
      const product = (productRows as any[])[0];

      if (!product || product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId}`);
      }

      await connection.execute(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // If it was a cart checkout, clear the cart
    if (!body.items) {
      await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    }

    await connection.commit();
    return { success: true, message: 'Checkout successful' };

  } catch (error: any) {
    await connection.rollback();
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Checkout failed',
    });
  } finally {
    connection.release();
  }
});
