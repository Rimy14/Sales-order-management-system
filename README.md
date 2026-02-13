# Sales Order Management System

A full-stack web application for managing sales orders, built with Spring Boot backend and React frontend.

## Project Structure

```
sales-order-app/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/com/spil/salesorder/
│   │       │   ├── controller/      # REST Controllers
│   │       │   ├── service/         # Business Logic
│   │       │   ├── repository/      # Data Access Layer
│   │       │   ├── domain/entity/   # JPA Entities
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   └── config/          # Configuration Classes
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── database-schema.sql
│
└── frontend/                # React application
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── redux/           # Redux store and slices
    │   ├── services/        # API services
    │   └── App.jsx
    └── package.json
```

## Technologies Used

### Backend
- **Spring Boot 3.2.1** - Main framework
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM
- **SQL Server** - Database
- **ModelMapper** - DTO mapping
- **Lombok** - Boilerplate code reduction
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Features

### Screen 1: Sales Order Form
- Customer selection with auto-populated address fields
- Editable address fields
- Dynamic item selection via dropdown (Item Code or Description)
- Automatic calculation of:
  - Excl Amount = Quantity × Price
  - Tax Amount = Excl Amount × Tax Rate / 100
  - Incl Amount = Excl Amount + Tax Amount
- Multiple items per order
- Total calculations (Total Excl, Total Tax, Total Incl)
- Create new orders
- Edit existing orders

### Screen 2: Home Page
- List all sales orders
- Add new order button
- Double-click to view/edit orders
- Display key order information in a table

## Setup Instructions

### Database Setup

1. Install SQL Server

2. Run the database schema script:
```bash
cd backend
sqlcmd -S localhost -U sa -P YourPassword123 -i database-schema.sql
```

Or execute the `database-schema.sql` file in SQL Server Management Studio.

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SalesOrderDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPassword123
```

3. Build and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

### Items
- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item

### Sales Orders
- `GET /api/sales-orders` - Get all sales orders
- `GET /api/sales-orders/{id}` - Get sales order by ID
- `POST /api/sales-orders` - Create new sales order
- `PUT /api/sales-orders/{id}` - Update sales order
- `DELETE /api/sales-orders/{id}` - Delete sales order

## Database Schema

### Tables
- `clients` - Customer information
- `items` - Product/service catalog
- `sales_orders` - Sales order headers
- `sales_order_items` - Sales order line items

## Architecture

### Backend Architecture (Layered/N-Tier)
```
Controller Layer (API) → Service Layer (Business Logic) → Repository Layer (Data Access) → Database
```

### Frontend Architecture
```
Components → Redux Store → API Services → Backend
```

## Development Notes

- The backend follows Spring Boot best practices with clear separation of concerns
- DTOs are used for data transfer between layers
- Frontend uses Redux Toolkit for centralized state management
- Tailwind CSS provides a responsive and modern UI
- All calculations are performed client-side with validation

## Sample Data

The database initialization script includes sample data:
- 5 sample clients
- 10 sample items with various prices

## Future Enhancements

- Print/PDF generation for sales orders
- User authentication and authorization
- Order status tracking
- Inventory management
- Reporting and analytics
- Email notifications
- Export to Excel/CSV

## License

This project is for educational purposes.

## Contact

For questions or support, please contact SPIL Labs (Pvt) Ltd.
