# Sales Order Management System

A full-stack web application for managing sales orders with Spring Boot backend and React frontend.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

- 📝 Create and manage sales orders
- 👥 Customer management with auto-populated addresses
- 📦 Product/item catalog
- 💰 Automatic tax and total calculations
- 🔄 Real-time updates with Redux state management
- 📱 Responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- MySQL (XAMPP recommended)

### 1️⃣ Database Setup

Start MySQL and create database:

```sql
CREATE DATABASE SalesOrderDB;
USE SalesOrderDB;
```

Run the schema from `backend/database-schema.sql` in phpMyAdmin or MySQL Workbench.

### 2️⃣ Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📋 Database Configuration

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/SalesOrderDB
spring.datasource.username=root
spring.datasource.password=
```

## 🏗️ Tech Stack

**Backend:** Spring Boot, JPA/Hibernate, MySQL  
**Frontend:** React, Redux Toolkit, Tailwind CSS, Axios  
**Build Tools:** Maven, Vite

## 📸 Screenshots

### Home Page
Lists all sales orders with search and filtering capabilities.

### Sales Order Form
Create/edit orders with automatic calculations and dynamic item management.

## 📚 API Documentation

Full API documentation available in `API_DOCUMENTATION.md`

**Base URL:** `http://localhost:8080/api`

- `/clients` - Customer management
- `/items` - Product catalog
- `/sales-orders` - Order management

## 🗂️ Project Structure

```
├── backend/          # Spring Boot (N-Tier Architecture)
│   ├── controller/   # REST API endpoints
│   ├── service/      # Business logic
│   ├── repository/   # Data access
│   ├── domain/       # JPA entities
│   └── dto/          # Data transfer objects
│
└── frontend/         # React application
    ├── pages/        # Main screens
    ├── redux/        # State management
    └── services/     # API integration
```

## ⚙️ Configuration

### MySQL (Default)
Uses XAMPP MySQL on port 3306

### SQL Server (Alternative)
See `SETUP_GUIDE.md` for SQL Server configuration

## 🧪 Testing

1. Open `http://localhost:3000`
2. Click "Add New" to create a sales order
3. Select customer, add items, and save
4. View saved orders on the home page

## 📖 Documentation

- `SETUP_GUIDE.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - Complete API reference
- `PROJECT_SUMMARY.md` - Implementation details


## 📝 License

Educational use only.

## 🆘 Troubleshooting

**Port conflict?** Change ports in configuration files  
**Database connection failed?** Check MySQL is running and credentials are correct  
**Build errors?** Ensure Java 17+ and Maven are installed

For detailed troubleshooting, see `SETUP_GUIDE.md`

---

