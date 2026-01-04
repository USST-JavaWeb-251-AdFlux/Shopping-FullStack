# 简易全栈购物网站 (Shopping-FullStack)

这是一个基于 **Nuxt 4**、**TypeScript** 和 **MySQL** 构建的简易全栈购物网站项目。它展示了如何使用 Nuxt 的服务端渲染 (SSR) 和服务器端 API 路由来构建一个完整的电商应用。

## ✨ 功能特性

- **全栈架构**: 使用 Nuxt 4 同时处理前端页面渲染和后端 API 逻辑。
- **数据库集成**: 使用 MySQL 存储用户、商品和购物车数据。
- **用户认证**: 完整的注册和登录流程，基于 JWT (JSON Web Token) 和 Cookie 进行身份验证。
- **商品管理**:
  - 商品列表展示
  - 商品分类筛选 (Clothing, Electronics, Furniture 等)
  - 价格排序
  - 商品详情页
- **购物车系统**:
  - 添加商品到购物车
  - 购物车内数量调整与移除
  - 购物车状态持久化 (数据库)
- **结账流程**: 模拟结账过程并更新商品库存。
- **UI 组件**: 集成 Element Plus 组件库，提供美观的界面交互。

## 🛠️ 技术栈

- **核心框架**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **编程语言**: TypeScript
- **数据库**: MySQL (通过 `mysql2` 驱动连接)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **UI 组件库**: [Element Plus](https://element-plus.org/)
- **安全**:
  - `bcrypt`: 密码哈希加密
  - `jsonwebtoken`: JWT 签发与验证

## 📋 前置要求

在运行项目之前，请确保您的环境已安装：

- **Node.js** (推荐 v18 或更高版本)
- **MySQL Server**
- **pnpm** (推荐) 或 npm/yarn

## 🚀 安装与运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在项目根目录下创建一个 `.env` 文件（可以参考 `.env.example`），并填入您的数据库配置和 JWT 密钥：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopping_db
JWT_SECRET=your_secret_key_change_this
```

### 3. 初始化数据库

运行初始化脚本以创建数据库和必要的表 (`users`, `products`, `cart_items`)：

```bash
node scripts/setup-db.js
```

### 4. 填充测试数据

运行种子脚本向数据库中添加初始商品数据：

```bash
node scripts/seed-products.js
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📂 项目结构

```
├── assets/             # 静态资源 (CSS 等)
├── layouts/            # Nuxt 布局文件 (default.vue)
├── middleware/         # 路由中间件 (auth.ts - 登录拦截)
├── pages/              # 页面路由
│   ├── product/        # 商品详情页 ([id].vue)
│   ├── cart.vue        # 购物车页
│   ├── login.vue       # 登录页
│   └── ...
├── public/             # 公共静态文件 (图片等)
├── scripts/            # 数据库初始化与数据填充脚本
├── server/             # 后端逻辑
│   ├── api/            # API 接口 (auth, cart, products)
│   └── utils/          # 后端工具函数 (db连接, jwt, auth)
├── stores/             # Pinia 状态管理 (cart, user)
├── nuxt.config.ts      # Nuxt 配置文件
└── package.json        # 项目依赖配置
```

## 📝 许可证

[MIT](LICENSE)
