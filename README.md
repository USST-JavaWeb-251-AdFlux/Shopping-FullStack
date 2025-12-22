# Minimal Shopping Website (Nuxt 4 Full Stack)

This is a minimal shopping website built with Nuxt 4 (compatible with Nuxt 3), TypeScript, and MySQL.

## Features

- **Full Stack:** Nuxt 4 (Server Side Rendering + API Routes).
- **Database:** MySQL for products, users, and cart items.
- **Authentication:** User registration and login (JWT/Cookie based).
- **Product Management:** List, filter (Category), sort (Price), and details.
- **Shopping Cart:** Add to cart, remove from cart, view cart.
- **Checkout:** Simplified checkout process that updates inventory.
- **Styling:** Traditional CSS with `border-box`.

## Prerequisites

- Node.js (v18+)
- MySQL Server

## Setup

1. **Install Dependencies:**

   ```bash
   pnpm install
   ```
2. **Configure Database:**

   - Create a MySQL database (e.g., `shopping_db`).
   - Copy `.env.example` to `.env` (if not exists) and update your database credentials.

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=shopping_db
   JWT_SECRET=your_secret_key
   ```
3. **Initialize Database:**

   Run the setup script to create tables (`users`, `products`, `cart_items`).

   ```bash
   node scripts/setup-db.js
   ```
4. **Seed Data:**

   Populate the database with initial products.

   ```bash
   node scripts/seed-products.js
   ```

## Development

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000`.

## Project Structure

- `app/`: Nuxt app root.
- `server/api/`: Backend API endpoints.
- `pages/`: Frontend pages.
- `stores/`: Pinia state management.
- `assets/css/`: Global styles.
- `scripts/`: Database setup and seeding scripts.

## API Endpoints

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login.
- `GET /api/products`: List products (supports `category` and `sort` query params).
- `GET /api/products/:id`: Get product details.
- `GET /api/cart`: Get user's cart.
- `POST /api/cart/add`: Add item to cart.
- `POST /api/checkout`: Process checkout.

## License

MIT
