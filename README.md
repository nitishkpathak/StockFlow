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
```

### JWT Information

The JWT contains information such as:

```text
Email
Role
Company ID
Issued Time
Expiration Time
```

### Security Features

- JWT-based authentication
- Stateless authentication
- BCrypt password hashing
- Role-based authorization
- Protected REST APIs
- Company-level data isolation
- Token expiration
- Unauthorized request handling

---

# 🏢 Multi-Company Data Isolation

StockFlow supports multiple companies using the same application.

Each company has its own:

- Users
- Products
- Categories
- Suppliers
- Stock Transactions

Company data is isolated using the authenticated user's company information.

```text
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
```

Users from one company cannot access inventory data belonging to another company.

---

# 🏗️ Application Architecture

```text
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
```

---

# 🧩 Backend Architecture

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller Layer

Handles HTTP requests and REST API endpoints.

### Service Layer

Contains business logic such as:

- Product validation
- Stock validation
- Company ownership verification
- User management
- Authentication
- Stock transaction creation

### Repository Layer

Uses Spring Data JPA to communicate with the MySQL database.

### Entity Layer

Represents database tables using JPA entities.

---

# 📦 Main Modules

- 🔐 Authentication
- 📊 Dashboard
- 📦 Products
- 🗂️ Categories
- 🚚 Suppliers
- 📈 Stock Management
- 🧾 Stock History
- 📑 Reports
- 👤 User Management

---

# 📦 Product Management

Products are the central part of the inventory system.

Each product contains:

- Product Name
- Price
- Quantity
- Description
- Category
- Supplier
- Company

### Product Operations

- Add Product
- View Product
- Update Product
- Delete Product

Only ADMIN users can modify product information.

Both ADMIN and STAFF users can view products.

---

# 🗂️ Category Management

Categories help organize inventory products.

Examples:

- Laptops
- Mobile Phones
- Accessories
- Monitors
- Keyboards

### Admin

- Add Category
- Update Category
- Delete Category

### Staff

- View Categories

---

# 🚚 Supplier Management

StockFlow allows administrators to manage suppliers.

Supplier information includes:

- Supplier Name
- Email
- Phone
- Address
- Company

### Admin

- Add Supplier
- Update Supplier
- Delete Supplier

### Staff

- View Suppliers

---

# 📈 Stock Management

StockFlow provides dedicated stock management operations.

Admins can increase or decrease the quantity of a product.

### Increase Stock

```text
Current Stock = 20

Increase = 10

New Stock = 30
```

### Decrease Stock

```text
Current Stock = 30

Decrease = 5

New Stock = 25
```

The application validates stock operations.

### Stock Validation

- Stock amount must be positive
- Stock cannot become negative
- Product ownership is verified
- Company ownership is verified
- Every stock movement is recorded

---

# 🧾 Stock History

Every stock increase or decrease creates a stock transaction.

Example:

```text
Product: Dell Inspiron 15

INCREASE  +10
DECREASE  -5
```

Stock history contains:

- Product
- Transaction Type
- Quantity
- Date and Time
- Company

This provides a clear record of inventory movement.

---

# 📊 Dashboard

The StockFlow dashboard provides an overview of the company's inventory.

It displays:

- Total Products
- Total Inventory Quantity
- Low Stock Products
- Inventory Statistics
- Recent Stock Activities
- Stock Movement Information
- Graphical Insights

Charts and visualizations are implemented using **Recharts**.

---

# 📑 Reports

The Reports section provides inventory-related insights using product and stock transaction data.

It helps users understand:

- Product quantities
- Stock movement
- Inventory statistics
- Low-stock products
- Inventory distribution

---

# 🔎 Search & Filtering

The Products section provides multiple search and filtering options.

Users can search/filter by:

- Product Name
- Category
- Stock Quantity
- Supplier

This makes it easier to find products when inventory grows.

---

# 🛠️ Technology Stack

## Frontend

- React.js
- JavaScript
- React Router
- Axios
- Tailwind CSS
- Recharts

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- JWT
- BCrypt
- Maven

## Database

- MySQL

## Developer Tools

- Git
- GitHub
- Postman
- VS Code
- Docker

## Deployment

- Vercel – Frontend
- Render – Backend
- Aiven – MySQL Database

---

# 🌐 REST API

## 🔐 Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## 📦 Products

```http
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Stock Operations

```http
POST /api/products/{id}/stock/increase
POST /api/products/{id}/stock/decrease
```

## 🗂️ Categories

```http
GET    /api/categories
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

## 🚚 Suppliers

```http
GET    /api/suppliers
GET    /api/suppliers/{id}
POST   /api/suppliers
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}
```

## 👤 Users

```http
GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

> User management endpoints are restricted to ADMIN users.

## 🧾 Stock Transactions

```http
GET /api/stock-transactions
```

---

# 🗃️ Database Design

Main entities:

```text
Company
User
Product
Category
Supplier
StockTransaction
```

### Relationship Overview

```text
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
```

### Main Database Tables

```text
companies
users
products
categories
suppliers
stock_transactions
```

---

# 📁 Project Structure

```text
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
```

---

# ⚙️ Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/nitishkpathak/StockFlow.git
cd StockFlow
```

---

## 2. Backend Setup

Go to the backend directory:

```bash
cd backend
```

Check Java installation:

```bash
java -version
```

Build the project:

### Windows

```bash
mvnw.cmd clean package
```

Run the backend:

```bash
mvnw.cmd spring-boot:run
```

Backend will run at:

```text
http://localhost:8080
```

---

## 3. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE stockflow_db;
```

Configure the following environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
FRONTEND_URL
```

Example:

```text
DB_URL=jdbc:mysql://localhost:3306/stockflow_db
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

> Never commit real database credentials or JWT secrets to GitHub.

---

## 4. Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment variable:

```text
REACT_APP_API_URL=http://localhost:8080/api
```

Start the frontend:

```bash
npm start
```

Frontend will run at:

```text
http://localhost:3000
```

---

# 🔄 Complete Application Flow

```text
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
```

---

# 🔒 Authorization Flow

```text
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
```

---

# 🧪 Testing

REST APIs can be tested using **Postman**.

Testing includes:

- User Registration
- User Login
- JWT Authentication
- Product CRUD
- Category CRUD
- Supplier CRUD
- Stock Increase
- Stock Decrease
- Stock History
- User Management
- Role-Based Authorization
- Company Data Isolation

---

# 🛡️ Validation & Error Handling

The application validates important operations such as:

- Required fields
- Duplicate email
- Positive stock quantity
- Insufficient stock
- Invalid JWT token
- Expired JWT token
- Product ownership
- Company ownership
- User permissions

Unauthorized requests are rejected by Spring Security.

---

# 📱 Responsive Design

The frontend is designed to work across different screen sizes.

Responsive UI is implemented for:

- Login
- Signup
- Dashboard
- Navbar
- Products
- Categories
- Suppliers
- Forms
- Tables
- Reports

---

# ☁️ Deployment Architecture

```text
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
```

### Frontend

[https://stock-flow-roan-alpha.vercel.app](https://stock-flow-roan-alpha.vercel.app)

### Backend

[https://stockflow-backend-k27w.onrender.com](https://stockflow-backend-k27w.onrender.com)

### Database

**Aiven MySQL**

---

# 📸 Screenshots

Screenshots of the application can be added here.

### 🔐 Login

_Add login screenshot here._

### 📊 Dashboard

_Add dashboard screenshot here._

### 📦 Products

_Add products screenshot here._

### 🗂️ Categories

_Add categories screenshot here._

### 🚚 Suppliers

_Add suppliers screenshot here._

### 🧾 Stock History

_Add stock history screenshot here._

### 📑 Reports

_Add reports screenshot here._

---

# 🎯 Learning Outcomes

Through this project, I gained practical experience with:

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- REST API Development
- Spring Data JPA
- Hibernate
- MySQL
- React.js
- React Router
- Axios
- Tailwind CSS
- Recharts
- Role-Based Authorization
- Multi-Company Data Isolation
- CRUD Operations
- Database Relationships
- API Testing
- Git & GitHub
- Docker
- Cloud Deployment

---

# 🔮 Future Improvements

Possible future enhancements include:

- 📧 Low-stock email notifications
- 📄 PDF/Excel report export
- 🖼️ Product image upload
- 📱 Barcode / QR code support
- 🔄 Refresh token mechanism
- 🔑 Password reset through email
- 📊 Advanced inventory analytics
- 🧾 Detailed audit logs
- 🧪 Automated unit and integration testing
- 🔁 CI/CD pipeline

---

# 👨‍💻 Author

## Nitish Kumar Pathak

**Software Engineer | Java · Spring Boot · JavaScript · React.js · Node.js**

### 🔗 GitHub

[Nitish Kumar Pathak](https://github.com/nitishkpathak)

### 🌐 Portfolio

[View Portfolio](https://nitishkpathak.github.io/Nitish-Portfolio/)

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is created for learning, development and portfolio purposes.
