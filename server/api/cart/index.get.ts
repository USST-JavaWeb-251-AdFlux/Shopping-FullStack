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
