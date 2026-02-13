# Sales Order Management System - Setup Guide

This guide will help you set up and run the Sales Order Management System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`

2. **Maven 3.6 or higher**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -version`

3. **Node.js 18 or higher and npm**
   - Download from: https://nodejs.org/
   - Verify installation: `node -version` and `npm -version`

4. **SQL Server 2019 or higher**
   - Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Or use SQL Server Express (free version)
   - Or use SQL Server in Docker:
     ```bash
     docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123" \
       -p 1433:1433 --name sqlserver \
       -d mcr.microsoft.com/mssql/server:2019-latest
     ```

5. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

## Step-by-Step Setup

### Step 1: Clone or Download the Project

If you have the GitHub repository:
```bash
git clone <repository-url>
cd sales-order-app
```

If you have the project as a ZIP file, extract it and navigate to the directory.

### Step 2: Database Setup

1. **Start SQL Server**
   - Ensure SQL Server is running on your machine

2. **Create the Database**
   
   Option A: Using SQL Server Management Studio (SSMS)
   - Open SSMS
   - Connect to your SQL Server instance
   - Open the file `backend/database-schema.sql`
   - Execute the script (F5)

   Option B: Using sqlcmd (Command Line)
   ```bash
   cd backend
   sqlcmd -S localhost -U sa -P YourPassword123 -i database-schema.sql
   ```

3. **Verify Database Creation**
   - Check that the database `SalesOrderDB` exists
   - Verify tables: clients, items, sales_orders, sales_order_items
   - Check that sample data has been inserted

### Step 3: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Update Database Configuration**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   # Update these values according to your SQL Server setup
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SalesOrderDB;encrypt=true;trustServerCertificate=true
   spring.datasource.username=sa
   spring.datasource.password=YourPassword123
   ```

3. **Build the Project**
   ```bash
   mvn clean install
   ```
   
   This will:
   - Download all dependencies
   - Compile the code
   - Run tests
   - Create a JAR file

4. **Run the Backend**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run the JAR file directly:
   ```bash
   java -jar target/sales-order-backend-1.0.0.jar
   ```

5. **Verify Backend is Running**
   - Open browser and go to: http://localhost:8080/api/clients
   - You should see a JSON array of clients
   - If you see data, the backend is working correctly!

### Step 4: Frontend Setup

1. **Open a new terminal** (keep the backend running)

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```
   
   This will download all required npm packages (may take a few minutes)

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - The browser should automatically open to http://localhost:3000
   - If not, manually open: http://localhost:3000
   - You should see the Home page with the sales orders list

### Step 5: Test the Application

1. **Home Page (Screen 2)**
   - Click "Add New" button to create a sales order
   - View the list of existing orders (sample data)
   - Double-click on any order to edit it

2. **Sales Order Page (Screen 1)**
   - Select a customer from the dropdown
   - Address fields should auto-populate
   - Fill in Invoice No and Date
   - Click "Add Item" to add order items
   - Select items using Item Code or Description dropdown
   - Enter Quantity and Tax Rate
   - Watch amounts calculate automatically
   - Click "Save Order" to create the order
   - You'll be redirected to the Home page

## Troubleshooting

### Backend Issues

**Problem: Can't connect to database**
```
Solution:
1. Verify SQL Server is running
2. Check connection string in application.properties
3. Ensure firewall allows connections on port 1433
4. Try connecting with SQL Server Management Studio first
```

**Problem: Port 8080 is already in use**
```
Solution:
Change the port in application.properties:
server.port=8081

Then update frontend API URL in src/services/api.js:
const API_BASE_URL = 'http://localhost:8081/api'
```

**Problem: Maven build fails**
```
Solution:
1. Check Java version: java -version (should be 17+)
2. Clear Maven cache: mvn clean
3. Delete .m2/repository folder and rebuild
```

### Frontend Issues

**Problem: npm install fails**
```
Solution:
1. Delete node_modules folder and package-lock.json
2. Clear npm cache: npm cache clean --force
3. Run npm install again
```

**Problem: Port 3000 is already in use**
```
Solution:
1. Stop the process using port 3000
2. Or change port in vite.config.js:
   server: { port: 3001 }
```

**Problem: CORS errors**
```
Solution:
1. Verify backend is running on port 8080
2. Check CORS configuration in backend AppConfig.java
3. Clear browser cache and reload
```

### Database Issues

**Problem: Authentication failed for user 'sa'**
```
Solution:
1. Reset SA password in SQL Server
2. Use Windows Authentication instead
3. Update application.properties accordingly
```

**Problem: Database doesn't exist**
```
Solution:
Run the database-schema.sql script again
```

## Running in Production

### Backend
```bash
# Build the JAR
mvn clean package

# Run the JAR
java -jar target/sales-order-backend-1.0.0.jar
```

### Frontend
```bash
# Build for production
npm run build

# Serve the built files
# Use nginx, Apache, or any static file server
```

## Next Steps

1. **Create your first sales order**
   - Test all functionality
   - Try editing an existing order
   - Verify calculations are correct

2. **Customize the application**
   - Add more clients and items via the API
   - Modify styling in Tailwind CSS
   - Add new features as needed

3. **Deploy to production**
   - Set up a production database
   - Configure environment variables
   - Deploy backend to a server
   - Deploy frontend to a web server or cloud platform

## Getting Help

If you encounter issues:
1. Check the console/terminal for error messages
2. Review the README.md file
3. Verify all prerequisites are installed correctly
4. Check database connectivity
5. Ensure both backend and frontend are running

## Additional Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev/
- Redux Toolkit: https://redux-toolkit.js.org/
- Tailwind CSS: https://tailwindcss.com/
- SQL Server Documentation: https://docs.microsoft.com/en-us/sql/

---

**Congratulations!** You should now have a fully functional Sales Order Management System running on your local machine.
