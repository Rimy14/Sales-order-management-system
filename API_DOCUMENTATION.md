# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Currently, the API does not require authentication. This should be added for production use.

## Response Format
All responses are in JSON format.

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Clients API

### Get All Clients
```http
GET /api/clients
```

**Response:**
```json
[
  {
    "id": 1,
    "customerName": "ABC Corporation",
    "address1": "123 Main Street",
    "address2": "Building A",
    "address3": "Floor 5",
    "state": "California",
    "postCode": "90001"
  }
]
```

### Get Client by ID
```http
GET /api/clients/{id}
```

**Parameters:**
- `id` (path parameter): Client ID

**Response:**
```json
{
  "id": 1,
  "customerName": "ABC Corporation",
  "address1": "123 Main Street",
  "address2": "Building A",
  "address3": "Floor 5",
  "state": "California",
  "postCode": "90001"
}
```

### Create Client
```http
POST /api/clients
```

**Request Body:**
```json
{
  "customerName": "New Company Ltd",
  "address1": "456 Business Ave",
  "address2": "Suite 100",
  "address3": "",
  "state": "New York",
  "postCode": "10001"
}
```

**Response:**
```json
{
  "id": 6,
  "customerName": "New Company Ltd",
  "address1": "456 Business Ave",
  "address2": "Suite 100",
  "address3": "",
  "state": "New York",
  "postCode": "10001"
}
```

### Update Client
```http
PUT /api/clients/{id}
```

**Parameters:**
- `id` (path parameter): Client ID

**Request Body:**
```json
{
  "customerName": "Updated Company Name",
  "address1": "789 New Street",
  "address2": "Floor 3",
  "address3": "",
  "state": "Texas",
  "postCode": "75001"
}
```

### Delete Client
```http
DELETE /api/clients/{id}
```

**Parameters:**
- `id` (path parameter): Client ID

**Response:** 204 No Content

---

## Items API

### Get All Items
```http
GET /api/items
```

**Response:**
```json
[
  {
    "id": 1,
    "itemCode": "ITM001",
    "description": "Laptop - Dell Latitude 5420",
    "price": 1200.00
  }
]
```

### Get Item by ID
```http
GET /api/items/{id}
```

**Response:**
```json
{
  "id": 1,
  "itemCode": "ITM001",
  "description": "Laptop - Dell Latitude 5420",
  "price": 1200.00
}
```

### Create Item
```http
POST /api/items
```

**Request Body:**
```json
{
  "itemCode": "ITM011",
  "description": "Gaming Mouse - RGB",
  "price": 75.00
}
```

### Update Item
```http
PUT /api/items/{id}
```

**Request Body:**
```json
{
  "itemCode": "ITM011",
  "description": "Gaming Mouse - RGB Pro",
  "price": 85.00
}
```

### Delete Item
```http
DELETE /api/items/{id}
```

---

## Sales Orders API

### Get All Sales Orders
```http
GET /api/sales-orders
```

**Response:**
```json
[
  {
    "id": 1,
    "invoiceNo": "INV-001",
    "invoiceDate": "2025-02-13",
    "referenceNo": "REF-123",
    "clientId": 1,
    "customerName": "ABC Corporation",
    "address1": "123 Main Street",
    "address2": "Building A",
    "address3": "Floor 5",
    "state": "California",
    "postCode": "90001",
    "items": [
      {
        "id": 1,
        "itemId": 1,
        "itemCode": "ITM001",
        "description": "Laptop - Dell Latitude 5420",
        "note": "Urgent delivery",
        "quantity": 2,
        "price": 1200.00,
        "taxRate": 10.00,
        "exclAmount": 2400.00,
        "taxAmount": 240.00,
        "inclAmount": 2640.00
      }
    ],
    "totalExclAmount": 2400.00,
    "totalTaxAmount": 240.00,
    "totalInclAmount": 2640.00,
    "createdDate": "2025-02-13",
    "lastModifiedDate": "2025-02-13"
  }
]
```

### Get Sales Order by ID
```http
GET /api/sales-orders/{id}
```

**Response:**
```json
{
  "id": 1,
  "invoiceNo": "INV-001",
  "invoiceDate": "2025-02-13",
  "referenceNo": "REF-123",
  "clientId": 1,
  "customerName": "ABC Corporation",
  "address1": "123 Main Street",
  "address2": "Building A",
  "address3": "Floor 5",
  "state": "California",
  "postCode": "90001",
  "items": [
    {
      "id": 1,
      "itemId": 1,
      "itemCode": "ITM001",
      "description": "Laptop - Dell Latitude 5420",
      "note": "Urgent delivery",
      "quantity": 2,
      "price": 1200.00,
      "taxRate": 10.00,
      "exclAmount": 2400.00,
      "taxAmount": 240.00,
      "inclAmount": 2640.00
    }
  ],
  "totalExclAmount": 2400.00,
  "totalTaxAmount": 240.00,
  "totalInclAmount": 2640.00,
  "createdDate": "2025-02-13",
  "lastModifiedDate": "2025-02-13"
}
```

### Create Sales Order
```http
POST /api/sales-orders
```

**Request Body:**
```json
{
  "invoiceNo": "INV-002",
  "invoiceDate": "2025-02-13",
  "referenceNo": "Customer PO: 12345",
  "clientId": 2,
  "address1": "456 Park Avenue",
  "address2": "Suite 200",
  "address3": "",
  "state": "New York",
  "postCode": "10001",
  "items": [
    {
      "itemId": 3,
      "note": "",
      "quantity": 3,
      "price": 300.00,
      "taxRate": 8.00,
      "exclAmount": 900.00,
      "taxAmount": 72.00,
      "inclAmount": 972.00
    },
    {
      "itemId": 5,
      "note": "Include warranty",
      "quantity": 5,
      "price": 25.00,
      "taxRate": 8.00,
      "exclAmount": 125.00,
      "taxAmount": 10.00,
      "inclAmount": 135.00
    }
  ],
  "totalExclAmount": 1025.00,
  "totalTaxAmount": 82.00,
  "totalInclAmount": 1107.00
}
```

**Response:** Returns the created sales order with ID

### Update Sales Order
```http
PUT /api/sales-orders/{id}
```

**Request Body:** Same as Create Sales Order

**Response:** Returns the updated sales order

### Delete Sales Order
```http
DELETE /api/sales-orders/{id}
```

**Response:** 204 No Content

---

## Calculation Formulas

### Item Line Calculations
```
Excl Amount = Quantity × Price
Tax Amount = Excl Amount × (Tax Rate / 100)
Incl Amount = Excl Amount + Tax Amount
```

### Order Totals
```
Total Excl Amount = Sum of all items' Excl Amount
Total Tax Amount = Sum of all items' Tax Amount
Total Incl Amount = Sum of all items' Incl Amount
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Resource deleted successfully |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Testing with cURL

### Get all clients
```bash
curl -X GET http://localhost:8080/api/clients
```

### Create a new client
```bash
curl -X POST http://localhost:8080/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Company",
    "address1": "123 Test St",
    "state": "CA",
    "postCode": "90001"
  }'
```

### Create a sales order
```bash
curl -X POST http://localhost:8080/api/sales-orders \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNo": "TEST-001",
    "invoiceDate": "2025-02-13",
    "clientId": 1,
    "address1": "123 Main St",
    "state": "CA",
    "postCode": "90001",
    "items": [
      {
        "itemId": 1,
        "quantity": 2,
        "price": 1200.00,
        "taxRate": 10.00,
        "exclAmount": 2400.00,
        "taxAmount": 240.00,
        "inclAmount": 2640.00
      }
    ],
    "totalExclAmount": 2400.00,
    "totalTaxAmount": 240.00,
    "totalInclAmount": 2640.00
  }'
```

---

## Notes

1. **Date Format**: All dates are in ISO format (YYYY-MM-DD)
2. **Decimal Values**: Prices and amounts support 2 decimal places
3. **Required Fields**: 
   - Client: customerName
   - Item: itemCode, description, price
   - Sales Order: invoiceNo, invoiceDate, clientId, items
4. **Cascading Deletes**: Deleting a sales order will automatically delete all associated items
5. **Unique Constraints**: invoiceNo and itemCode must be unique
