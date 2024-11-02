# Table of Contents

- [Authentication API](#authentication-api)
- [Dev Notes](#dev-notes)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [Authentication Routes](#authentication-routes)
    - [Register User](#register-user)
    - [Verify Email](#verify-email)
    - [Login](#login)
    - [Forgot Password](#forgot-password)
    - [Reset Password](#reset-password)
- [Authentication Flow](#authentication-flow)
  - [1. Registration](#registration)
  - [2. Email Verification](#email-verification)
  - [3. Login](#login-1)
  - [4. Password Reset](#password-reset)
- [Protected Routes](#protected-routes)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Adding New Features](#adding-new-features)

# Authentication API

A robust authentication API built with Express.js, TypeScript, and PostgreSQL, featuring email verification, password reset, and JWT-based authentication.

# Dev notes

I highly suggest using an existing authentication and authorization solution for your authentication needs and not rolling your own, as there are going to be a lot of edge cases and security concerns that you'll have to deal with that are not covered in this project.

## Features

- 🔐 User registration with email verification
- 📧 Password reset via email
- 🔑 JWT-based authentication with refresh tokens
- 📝 Input validation using Zod
- 🛡️ TypeScript for type safety
- 🎭 Password hashing with bcrypt
- 🗃️ PostgreSQL database with Drizzle ORM
- ⚡ Error handling middleware
- 🔒 Passport.js JWT strategy

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- SMTP server credentials (for email functionality)

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/FredMT/express-passport-drizzle-starter.git
cd express-passport-drizzle-starter
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Copy the `.env.sample` file to `.env` and update the values, or just rename the `.env.sample` file to `.env` and update the values:

```bash
cp .env.sample .env
```

Required environment variables:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
SMTP_HOST=<smtp-host>
SMTP_PORT=<smtp-port>
SMTP_USER=<smtp-username>
SMTP_PASS=<smtp-password>
SMTP_FROM=<sender-email>
FRONTEND_URL=<your-frontend-url>
NODE_ENV=development
```

4. **Database Setup**

Create your database and then generate and run the migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

5. **Start the server**

Development mode:

```bash
npm run dev
```

## API Endpoints

### Authentication Routes

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
}
```

#### Verify Email

```http
GET /api/auth/verify-email/:token
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
    "credential": "johndoe", // username or email
    "password": "securepassword123"
}
```

#### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
    "email": "john@example.com"
}
```

#### Reset Password

```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
    "password": "newpassword123"
}
```

## Authentication Flow

1. **Registration**

   - User submits registration details
   - System validates input
   - Password is hashed
   - Verification email is sent
   - User account is created (unverified)

2. **Email Verification**

   - User clicks verification link in email
   - Email is verified
   - Account is marked as active

3. **Login**

   - User submits credentials
   - System validates credentials
   - Returns JWT access and refresh tokens

4. **Password Reset**
   - User requests password reset
   - Reset link is sent via email
   - User sets new password using reset token

## Protected Routes

To protect routes that require authentication, use the `requireAuth` middleware. This middleware verifies the JWT token and ensures the user is authenticated before allowing access to the route.

Example usage:

```typescript
import { requireAuth } from "../shared/middleware/auth";

// Protected route example
router.get("/protected-route", requireAuth, (req, res) => {
  // Only authenticated users can access this route
  // User information is available in req.user
  res.json({ user: req.user });
});
```

The middleware will:

- Verify the JWT token from the Authorization header
- Check if the user exists in the database
- Add the user object to the request
- Return 401 Unauthorized if authentication fails

## Error Handling

The API uses a centralized error handling system with custom `AppError` class. Common error responses:

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [] // Additional error details (if any)
}
```

## Security Features

- Passwords are hashed using bcrypt
- Email verification required before login
- JWT tokens for authentication
- Input validation and sanitization
- Protected routes using Passport.js middleware

## Development

### Project Structure

```
src/
├── config/         # Configuration files
├── db/            # Database setup and schema
├── features/      # Feature modules
│   └── auth/      # Authentication feature
├── shared/        # Shared utilities and middleware
└── types/         # TypeScript type definitions
```

### Adding New Features

1. Create a new feature directory under `src/features/`
2. Follow the modular pattern:
   - controllers/
   - services/
   - repositories/
   - validators/
   - types/
   - routes.ts
