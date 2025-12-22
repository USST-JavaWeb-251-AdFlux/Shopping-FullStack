import pool from '~/server/utils/db';
import { getUserFromEvent } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  const userId = user.id;

  try {
    const [rows] = await pool.execute(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.mainImage 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId]);
    return rows;
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error fetching cart' });
  }
});
