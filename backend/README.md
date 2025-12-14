# ArogyaLink Backend Server

Backend server for ArogyaLink application with MongoDB database integration.

## Features

- User authentication (Sign Up & Sign In)
- Role-based user management (Patient, Asha Worker, PHC Doctor)
- MongoDB database integration
- Password hashing with bcrypt
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/arogyalink
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arogyalink
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

### Authentication
- **POST** `/api/auth/signup` - Register a new user
  - Body: `{ name, email (optional), mobile, password, role }`
  - Roles: `Patient`, `Asha Worker`, `PHC Doctor`

- **POST** `/api/auth/signin` - Sign in user
  - Body: `{ email OR mobile, password }`

- **GET** `/api/auth/user/:id` - Get user by ID

## User Model

```javascript
{
  name: String (required),
  email: String (optional),
  mobile: String (required, 10 digits),
  password: String (required, min 6 characters),
  role: String (required, enum: ['Patient', 'Asha Worker', 'PHC Doctor']),
  isApproved: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Configuration

Update the API base URL in `config/api.js`:

- For iOS Simulator: `http://localhost:5000`
- For Android Emulator: `http://10.0.2.2:5000`
- For Physical Device: `http://YOUR_COMPUTER_IP:5000` (e.g., `http://192.168.1.100:5000`)

## Testing

You can test the API endpoints using:
- Postman
- curl
- Thunder Client (VS Code extension)

Example signup request:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "password": "password123",
    "role": "Patient"
  }'
```

Example signin request:
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "password": "password123"
  }'
```

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct.

2. **Port Already in Use**: Change the PORT in `.env` file or stop the process using port 5000.

3. **CORS Issues**: The server is configured to allow CORS from all origins. For production, restrict this to your frontend domain.

4. **Module Not Found**: Run `npm install` again to ensure all dependencies are installed.

## Security Notes

- Passwords are hashed using bcrypt before storing
- Never commit `.env` file to version control
- In production, use environment variables for sensitive data
- Consider adding JWT tokens for authentication in future updates

