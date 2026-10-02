# 📦 StockFlow – Inventory Management System

**A full-stack Inventory Management System built with Java, Spring Boot, React.js and MySQL.**

StockFlow is designed to help businesses manage products, categories, suppliers, users, stock operations and inventory activities from a centralized and secure platform.

---

## 🚀 Live Demo

### 🌐 Frontend

[https://stock-flow-roan-alpha.vercel.app](https://stock-flow-roan-alpha.vercel.app)

### 🔗 Backend API

[https://stockflow-backend-k27w.onrender.com](https://stockflow-backend-k27w.onrender.com)

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

Staff users have limited access to inventory information.

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

Email
Role
Company ID
Issued Time
Expiration Time


Company A
│
├── Users
├── Products
├── Categories
├── Suppliers
└── Stock History


Company B
│
├── Users
├── Products
├── Categories
├── Suppliers
└── Stock History

                    ┌─────────────────────┐
                    │      React.js       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │      Backend        │
                    ├─────────────────────┤
                    │ Spring Security     │
                    │ JWT Authentication  │
                    │ REST Controllers    │
                    │ Service Layer       │
                    │ JPA / Hibernate     │
                    └──────────┬──────────┘
                               │
                               │ JPA / JDBC
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Database       │
                    └─────────────────────┘

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

🌐 REST API
🔐 Authentication
POST /api/auth/register
POST /api/auth/login
📦 Products
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
Stock Operations
POST /api/products/{id}/stock/increase
POST /api/products/{id}/stock/decrease
🗂️ Categories
GET    /api/categories
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
🚚 Suppliers
GET    /api/suppliers
GET    /api/suppliers/{id}
POST   /api/suppliers
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}
👤 Users
GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}

User management endpoints are restricted to ADMIN users.

🧾 Stock Transactions
GET /api/stock-transactions
🗃️ Database Design

Main entities:

Company
User
Product
Category
Supplier
StockTransaction
Relationship Overview
                 Company
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
      Users      Products    Categories
                    │
              ┌─────┴─────┐
              ▼           ▼
          Category     Supplier
                    │
                    ▼
             StockTransaction
Main Database Tables
companies
users
products
categories
suppliers
stock_transactions
📁 Project Structure
StockFlow/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/stockflow/backend/
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
⚙️ Local Setup
1. Clone the Repository
git clone https://github.com/nitishkpathak/StockFlow.git
cd StockFlow
2. Backend Setup

Go to the backend directory:

cd backend

Check Java installation:

java -version

Build the project:

Windows
mvnw.cmd clean package

Run the backend:

mvnw.cmd spring-boot:run

Backend will run at:

http://localhost:8080
3. Database Setup

Create a MySQL database:

CREATE DATABASE stockflow_db;

Configure the following environment variables:

DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
FRONTEND_URL

Example:

DB_URL=jdbc:mysql://localhost:3306/stockflow_db
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000

Never commit real database credentials or JWT secrets to GitHub.

4. Frontend Setup

Open another terminal.

cd frontend

Install dependencies:

npm install

Create the frontend environment variable:

REACT_APP_API_URL=http://localhost:8080/api

Start the frontend:

npm start

Frontend will run at:

http://localhost:3000
🔄 Complete Application Flow
                         User
                           │
                           ▼
                    Register / Login
                           │
                           ▼
                     Authentication
                           │
                           ▼
                       JWT Token
                           │
                           ▼
                  Protected API Request
                           │
                           ▼
                JWT Authentication Filter
                           │
                           ▼
                   Role Verification
                           │
                           ▼
                 Company Verification
                           │
                           ▼
                      Controller
                           │
                           ▼
                        Service
                           │
                           ▼
                       Repository
                           │
                           ▼
                         MySQL
🔒 Authorization Flow
ADMIN
 │
 ├── Product CRUD              ✅
 ├── Category CRUD             ✅
 ├── Supplier CRUD             ✅
 ├── Stock Operations          ✅
 ├── User Management           ✅
 ├── Stock History             ✅
 └── Reports                   ✅


STAFF
 │
 ├── View Products             ✅
 ├── View Categories           ✅
 ├── View Suppliers            ✅
 ├── View Stock History        ✅
 ├── View Reports              ✅
 └── Modify Inventory          ❌
🧪 Testing

REST APIs can be tested using Postman.

Testing includes:

User Registration
User Login
JWT Authentication
Product CRUD
Category CRUD
Supplier CRUD
Stock Increase
Stock Decrease
Stock History
User Management
Role-Based Authorization
Company Data Isolation
🛡️ Validation & Error Handling

The application validates important operations such as:

Required fields
Duplicate email
Positive stock quantity
Insufficient stock
Invalid JWT token
Expired JWT token
Product ownership
Company ownership
User permissions

Unauthorized requests are rejected by Spring Security.

📱 Responsive Design

The frontend is designed to work across different screen sizes.

Responsive UI is implemented for:

Login
Signup
Dashboard
Navbar
Products
Categories
Suppliers
Forms
Tables
Reports
☁️ Deployment Architecture
                 ┌───────────────────┐
                 │      Vercel       │
                 │  React Frontend   │
                 └─────────┬─────────┘
                           │
                           │ HTTPS / REST API
                           ▼
                 ┌───────────────────┐
                 │      Render       │
                 │ Spring Boot API   │
                 └─────────┬─────────┘
                           │
                           │ MySQL
                           ▼
                 ┌───────────────────┐
                 │      Aiven        │
                 │  MySQL Database   │
                 └───────────────────┘
Frontend

https://stock-flow-roan-alpha.vercel.app

Backend

https://stockflow-backend-k27w.onrender.com

Database

Aiven MySQL

📸 Screenshots

Screenshots of the application can be added here.

🔐 Login

Add login screenshot here.

📊 Dashboard

Add dashboard screenshot here.

📦 Products

Add products screenshot here.

🗂️ Categories

Add categories screenshot here.

🚚 Suppliers

Add suppliers screenshot here.

🧾 Stock History

Add stock history screenshot here.

📑 Reports

Add reports screenshot here.

🎯 Learning Outcomes

Through this project, I gained practical experience with:

Java
Spring Boot
Spring Security
JWT Authentication
REST API Development
Spring Data JPA
Hibernate
MySQL
React.js
React Router
Axios
Tailwind CSS
Recharts
Role-Based Authorization
Multi-Company Data Isolation
CRUD Operations
Database Relationships
API Testing
Git & GitHub
Docker
Cloud Deployment
🔮 Future Improvements

Possible future enhancements include:

📧 Low-stock email notifications
📄 PDF/Excel report export
🖼️ Product image upload
📱 Barcode / QR code support
🔄 Refresh token mechanism
🔑 Password reset through email
📊 Advanced inventory analytics
🧾 Detailed audit logs
🧪 Automated unit and integration testing
🔁 CI/CD pipeline
👨‍💻 Author
Nitish Kumar Pathak

Software Engineer | Java · Spring Boot · JavaScript · React.js · Node.js

🔗 GitHub

Nitish Kumar Pathak

🌐 Portfolio

View Portfolio
