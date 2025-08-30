# 👟 Shoes Store E-commerce

A modern, full-featured e-commerce web application for a shoe store, built with **React** and **Vite**. This project delivers a complete online shopping experience with a fast, responsive UI, advanced cart/wishlist management, secure authentication, and a robust admin panel.

[Live Demo](https://shoes-store-six-sigma.vercel.app)

---

## ✨ Features

- **User Authentication & Profile**
  - Register, login, logout, email verification & password reset
  - Update profile, manage addresses, payment methods, and preferences

- **Product Catalog**
  - Browse shoes by category, brand, features (new, sale, featured)
  - Product detail pages with images, sizing, and pricing
  - Search and filter products

- **Wishlist**
  - Add/remove products to your wishlist
  - Wishlist persists for guests (localStorage) and logged-in users (server-side)

- **Cart & Checkout**
  - Add, update, or remove products in the cart
  - Apply coupons and discounts
  - Secure, multi-step checkout with Stripe and Cash on Delivery support

- **Order Management**
  - Track your orders and order history
  - Cancel orders and request refunds

- **Admin Dashboard**
  - Product CRUD (create, update, delete products)
  - User management (view/update/delete users)
  - Order management and store settings

- **Responsive Design**
  - Mobile-first, optimized for all devices

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, React Router, Context API
- **UI:** TailwindCSS, React Hot Toast
- **Authentication:** JWT, localStorage
- **APIs:** RESTful endpoints for products, users, cart, checkout, orders
- **Payments:** Stripe integration
- **State Management:** React Context, useReducer, useState
- **Admin:** Custom admin panel for managing products, users, and orders

---


## 📂 Project Structure

```
src/
│
├── admin/                # Admin dashboard components
├── components/           # Reusable UI components
├── Context/              # React Contexts for global state (cart, wishlist, auth)
├── Pages/                # Pages for routing (Home, Product, Cart, Checkout, etc.)
├── services/             # API service modules
└── App.jsx               # Main app entry point
```

---



## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Stripe](https://stripe.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

> Made with ❤️ by [Chaudaryabdullah89](https://github.com/Chaudaryabdullah89)
