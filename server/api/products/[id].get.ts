import pool from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    const products = rows as any[];

    if (products.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }

    return products[0];
  } catch (error: any) {
    // Preserve existing HTTP errors (e.g., those created with createError)
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching product',
      cause: error,
    });
  }
});
