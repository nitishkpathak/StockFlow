# 📦 StockFlow – Inventory Management System

<p align="center">
  <b>A full-stack Inventory Management System built with Java, Spring Boot, React.js and MySQL.</b>
</p>

<p align="center">
  Manage products, categories, suppliers, users, stock operations and inventory activities from a centralized platform.
</p>

---

## 🚀 Live Demo

### 🌐 Frontend

https://stock-flow-roan-alpha.vercel.app

### 🔗 Backend API

https://stockflow-backend-k27w.onrender.com

> **Note:** The backend is deployed on Render's free tier. If the service has been inactive for some time, the first request may take a little longer while the server starts.

---

# 📌 About the Project

**StockFlow** is a full-stack Inventory Management System developed to simplify and centralize inventory operations for businesses.

The application allows companies to manage their products, categories, suppliers, users and stock movements through a secure web-based dashboard.

StockFlow supports **role-based access control** and **company-level data isolation**, allowing multiple companies to use the same application while keeping their inventory data separate.

---

# ✨ Key Features

- 🔐 JWT-based Authentication
- 🔒 BCrypt Password Encryption
- 👥 Role-Based Access Control
- 🏢 Multi-Company Data Isolation
- 📦 Product Management
- 🗂️ Category Management
- 🚚 Supplier Management
- 📈 Stock Increase & Decrease
- 🧾 Stock Movement History
- 📊 Dashboard & Reports
- 🔎 Product Search & Filtering
- 👤 User Management
- 📉 Low Stock Monitoring
- 📱 Responsive User Interface
- ☁️ Cloud Deployment

---

# 👥 User Roles

StockFlow provides two different user roles.

## 👑 ADMIN

Admin users have complete management access.

### Admin can:

- Add products
- Update products
- Delete products
- Increase stock
- Decrease stock
- Add categories
- Update categories
- Delete categories
- Add suppliers
- Update suppliers
- Delete suppliers
- Add users
- Update users
- Delete users
- View stock history
- View reports
- View dashboard statistics

---

## 👤 STAFF

Staff users have read-only access to inventory information.

### Staff can:

- View products
- View categories
- View suppliers
- View stock history
- View reports
- View dashboard information

### Staff cannot:

- Add products
- Update products
- Delete products
- Modify stock
- Modify categories
- Modify suppliers
- Manage users

All important authorization rules are enforced on the backend using Spring Security.

---

# 🔐 Authentication & Security

StockFlow uses **Spring Security and JWT** to secure the application.

### Authentication Flow

```text
User
  ↓
Login
  ↓
Spring Boot validates credentials
  ↓
JWT Token generated
  ↓
Token stored in browser
  ↓
Token sent with API requests
  ↓
JWT Authentication Filter
  ↓
User authenticated
  ↓
Role & Company verified
  ↓
Request processed
