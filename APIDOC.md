# MailFlow API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string"
}

Response 201:
{
    "user": {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    },
    "token": "jwt_token"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}

Response 200:
{
    "user": {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    },
    "token": "jwt_token"
}
```

### Organizations

#### Create Organization
```http
POST /organizations
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "string",
    "description": "string" (optional)
}

Response 201:
{
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "description": "string",
    "settings": {
        "emailCustomization": {
            "fromName": "string",
            "fromEmail": "string"
        },
        "brandColors": {
            "primary": "string",
            "secondary": "string"
        }
    },
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```

#### Get User's Organizations
```http
GET /organizations
Authorization: Bearer <token>

Response 200:
[
    {
        "id": "uuid",
        "name": "string",
        "slug": "string",
        "description": "string",
        "settings": {...},
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
]
```

#### Get Organization by ID
```http
GET /organizations/:id
Authorization: Bearer <token>

Response 200:
{
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "description": "string",
    "settings": {...},
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```

## Error Responses

### Common Error Formats
```json
{
    "error": "Error message description"
}
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Testing Examples

### Using cURL

1. Register a new user:
```bash
curl -X POST http://localhost:4000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123"
}'
```

2. Login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "Password123"
}'
```

3. Create Organization:
```bash
curl -X POST http://localhost:4000/api/organizations \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "name": "My Organization",
  "description": "Description of my organization"
}'
```

## Development Environment Setup

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Redis
- RabbitMQ

### Environment Variables
```env
NODE_ENV=development
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=mailflow
DB_PASSWORD=mailflow123
DB_NAME=mailflow

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### Running the Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```