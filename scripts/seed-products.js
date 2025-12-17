import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'shopping_db',
  });

  try {
    const dataPath = path.resolve(__dirname, '../data/products.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const products = JSON.parse(data);

    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM cart_items');
    await connection.execute('DELETE FROM products');
    await connection.execute('ALTER TABLE products AUTO_INCREMENT = 1');

    console.log(`Seeding ${products.length} products...`);

    for (const product of products) {

      await connection.execute(
        'INSERT INTO products (name, price, description, category, mainImage, quantity) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.price, product.description, product.category, product.mainImage, product.quantity]
      );
    }

    console.log('Seeding complete.');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await connection.end();
  }
}

seed();
