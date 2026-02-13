-- Sales Order Management Database Schema for SQL Server

-- Create Database
CREATE DATABASE SalesOrderDB;
GO

USE SalesOrderDB;
GO

-- Create Clients Table
CREATE TABLE clients (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_name NVARCHAR(255) NOT NULL,
    address1 NVARCHAR(255),
    address2 NVARCHAR(255),
    address3 NVARCHAR(255),
    state NVARCHAR(100),
    post_code NVARCHAR(20)
);
GO

-- Create Items Table
CREATE TABLE items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    item_code NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
GO

-- Create Sales Orders Table
CREATE TABLE sales_orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    invoice_no NVARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    reference_no NVARCHAR(100),
    client_id BIGINT NOT NULL,
    address1 NVARCHAR(255),
    address2 NVARCHAR(255),
    address3 NVARCHAR(255),
    state NVARCHAR(100),
    post_code NVARCHAR(20),
    total_excl_amount DECIMAL(12,2),
    total_tax_amount DECIMAL(12,2),
    total_incl_amount DECIMAL(12,2),
    created_date DATE NOT NULL,
    last_modified_date DATE,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
GO

-- Create Sales Order Items Table
CREATE TABLE sales_order_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    sales_order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    note NVARCHAR(500),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    excl_amount DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    incl_amount DECIMAL(12,2),
    FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
);
GO

-- Insert Sample Clients
INSERT INTO clients (customer_name, address1, address2, address3, state, post_code) VALUES
('ABC Corporation', '123 Main Street', 'Building A', 'Floor 5', 'California', '90001'),
('XYZ Ltd', '456 Park Avenue', 'Suite 200', '', 'New York', '10001'),
('Global Traders Inc', '789 Business Blvd', 'Tower B', 'Office 301', 'Texas', '75001'),
('Tech Solutions Pvt Ltd', '321 Tech Park', 'Block C', '', 'Washington', '98001'),
('Green Earth Co', '654 Eco Street', 'Unit 12', '', 'Oregon', '97001');
GO

-- Insert Sample Items
INSERT INTO items (item_code, description, price) VALUES
('ITM001', 'Laptop - Dell Latitude 5420', 1200.00),
('ITM002', 'Desktop Computer - HP ProDesk', 850.00),
('ITM003', 'Monitor - 27 inch LED', 300.00),
('ITM004', 'Keyboard - Wireless', 45.00),
('ITM005', 'Mouse - Optical Wireless', 25.00),
('ITM006', 'Printer - Laser Multifunction', 450.00),
('ITM007', 'Office Chair - Ergonomic', 280.00),
('ITM008', 'Desk - Standing Adjustable', 650.00),
('ITM009', 'USB Hub - 7 Port', 35.00),
('ITM010', 'Webcam - HD 1080p', 85.00);
GO

-- Create indexes for better performance
CREATE INDEX idx_client_name ON clients(customer_name);
CREATE INDEX idx_item_code ON items(item_code);
CREATE INDEX idx_invoice_no ON sales_orders(invoice_no);
CREATE INDEX idx_sales_order_date ON sales_orders(created_date DESC);
GO

PRINT 'Database schema created successfully!';
PRINT 'Sample data inserted successfully!';
GO
