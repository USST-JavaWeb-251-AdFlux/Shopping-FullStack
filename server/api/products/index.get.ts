import pool from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const category = query.category as string;
  const sort = query.sort as string; // 'price_asc' or 'price_desc'
  const search = query.search as string;

  let sql = 'SELECT * FROM products';
  const params: any[] = [];
  const conditions: string[] = [];

  if (category && category !== 'All') {
    conditions.push('category = ?');
    params.push(category);
  }

  if (search) {
    conditions.push('name LIKE ?');
    params.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort === 'price_desc') {
    sql += ' ORDER BY price DESC';
  } else if (sort === 'price_asc') {
    sql += ' ORDER BY price ASC';
  }


  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching products',
    });
  }
});
