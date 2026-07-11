# 🏠 RentNest Backend API

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-5-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)

RentNest is a scalable **rental property marketplace backend API** built with modern backend technologies.

The platform allows landlords to publish and manage properties, tenants to request rentals, complete payments, and interact through reviews.

The project follows a modular architecture with secure authentication, role-based authorization, database relationships, validation, and payment integration.

---

# 🚀 Live Resources

## GitHub Repository

https://github.com/devpolas/rent-nest-backend-api.git

## Live API

https://rent-nest-backend-api.vercel.app

## ERD Diagram

https://mermaid.ai/d/9191acab-e6d7-4fe9-9c01-021105f3b605

## Postman Documentation

https://documenter.getpostman.com/view/29526538/2sBY4LS2dr

or

https://pcb951-s-team.docs.buildwithfern.com/rent-nest/health

---

# ✨ Features

## 🔐 Authentication & Authorization

Implemented with JWT authentication and HTTP-only cookies.

Features:

- User registration
- User login
- Access token authentication
- Refresh token system
- Cookie-based authentication
- Protected routes
- Role-based authorization
- Account status checking

User roles:

```text
TENANT
LANDLORD
MODERATOR
ADMIN
```

User status:

```text
ACTIVE
DEACTIVATE
BLOCKED
BANNED
```

---

# 👤 User Management

Users can:

- Create accounts
- Login
- Update their profile
- Delete their account
- Manage locations
- Add social profiles

Profile information:

- Profile image
- Bio
- Birth date
- Social links
- Multiple locations

---

# 🏡 Property Management

Landlords can create and manage rental properties.

Features:

- Create property
- Update property
- Delete property
- View properties
- View own properties

Property contains:

- Title
- Description
- Rent
- Security deposit
- Bedrooms
- Bathrooms
- Area
- Availability
- Status
- Images
- Category
- Amenities
- Features
- Rules
- Location

Property status:

```text
PENDING
APPROVED
REJECTED
RENTED
ARCHIVED
```

Availability:

```text
AVAILABLE
RESERVED
RENTED
UNAVAILABLE
```

---

# 📝 Rental Request System

Tenants can send rental requests to landlords.

Workflow:

```
Tenant
   |
   |
Rental Request
   |
   |
Landlord Review
   |
   |
Approve / Reject
   |
   |
Payment
   |
   |
Active Rental
```

Rental request status:

```text
PENDING
APPROVED
REJECTED
PAYMENT_PENDING
ACTIVE
COMPLETED
CANCELLED
EXPIRED
```

---

# 💳 Payment System

Integrated with Stripe.

Features:

- Create checkout session
- Payment processing
- Transaction tracking
- Payment history

Payment status:

```text
PENDING
SUCCESS
FAILED
CANCELLED
EXPIRED
REFUNDED
```

---

# ⭐ Review System

Tenants can review properties.

Features:

- Create review
- Update review
- Delete review
- View property reviews

---

# 🏷 Property Metadata

Properties support reusable metadata.

## Categories

Examples:

- Apartment
- House
- Office

## Amenities

Examples:

- Parking
- Security
- Air Conditioning

## Features

Examples:

- Balcony
- Garden
- Swimming Pool

## Rules

Examples:

- No Smoking
- No Pets

---

# 🛠 Technology Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL

## ORM

- Prisma ORM

## Authentication

- JWT
- Cookie Parser

## Validation

- Zod

## Payment

- Stripe

## Build Tools

- TSUP
- TSX

---

# 📂 Project Structure

```
src
│
├── config
│
├── lib
│   ├── prisma.ts
│   └── stripe.ts
│
├── middlewares
│   ├── auth.ts
│   └── error.ts
│
├── modules
│
│   ├── auth
│   ├── user
│   ├── property
│   ├── rental
│   ├── payments
│   ├── reviews
│   ├── category
│   ├── amenity
│   ├── feature
│   └── rule
│
├── utils
│
├── app.ts
└── server.ts
```

---

# 🗄 Database Architecture

Main entities:

```
User
 |
 ├── Profile
 │      |
 │      ├── Location
 │      └── SocialProfile
 │
 ├── Property
 │      |
 │      ├── PropertyImage
 │      ├── PropertyCategory
 │      ├── PropertyAmenities
 │      ├── PropertyFeatures
 │      └── PropertyRules
 │
 ├── RentalRequests
 │
 ├── Reviews
 │
 └── Payments
```

---

# 🔑 Authentication Flow

```
Login
 |
 ↓
Generate JWT Token
 |
 ↓
Store Cookie
 |
 ↓
Protect Middleware
 |
 ↓
Verify Token
 |
 ↓
Check User Status
 |
 ↓
Authorize Request
```

---

# ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/devpolas/rent-nest-backend-api.git

cd rent-nest-backend-api
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create `.env`

```env
# ============================================
# Application
# ============================================

NODE_ENV=development
PORT=8000

APP_URL=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174

WEBSITE_URL=http://localhost:3000


# ============================================
# Database
# ============================================

DATABASE_URL=postgres://username:password@localhost:5432/database_name?sslmode=require


# ============================================
# JWT Authentication
# ============================================

JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN=24h

JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d


# ============================================
# Stripe
# ============================================

STRIPE_SECRET=sk_test_your_stripe_secret_key
```

---

# Prisma Commands

Generate Prisma client:

```bash
npx prisma generate
```

Run migration:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# Development

Run development server:

```bash
npm run dev
```

Server:

```
http://localhost:8000
```

---

# Production Build

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

---

# 📚 API Documentation

Base URL:

```
/api/v1
```

---

# Authentication Routes

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/signin
GET    /api/v1/auth/refresh-token
GET    /api/v1/auth/me
```

---

# User Routes

```
PATCH  /api/v1/users
DELETE /api/v1/users

GET    /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

---

# Property Routes

Public:

```
GET /api/v1/properties
GET /api/v1/properties/:id
```

Landlord:

```
GET    /api/v1/properties/my
POST   /api/v1/properties
PATCH  /api/v1/properties/:id
DELETE /api/v1/properties/:id
```

Nested Reviews:

```
GET  /api/v1/properties/:propertyId/reviews
POST /api/v1/properties/:propertyId/reviews
```

---

# Rental Request Routes

```
POST   /api/v1/rental-requests
GET    /api/v1/rental-requests
GET    /api/v1/rental-requests/:id
PATCH  /api/v1/rental-requests/:id
DELETE /api/v1/rental-requests/:id
```

Payment:

```
POST /api/v1/rental-requests/:rentRequestId/payment
```

---

# Payment Routes

```
POST /api/v1/payments
GET  /api/v1/payments
GET  /api/v1/payments/session/:sessionId
GET  /api/v1/payments/transaction/:transactionId
```

---

# Review Routes

```
GET    /api/v1/reviews/:id
POST   /api/v1/reviews
PATCH  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```

---

# Category Routes

```
GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/categories
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

---

# Amenity Routes

```
GET    /api/v1/amenities
GET    /api/v1/amenities/:id
POST   /api/v1/amenities
PATCH  /api/v1/amenities/:id
DELETE /api/v1/amenities/:id
```

---

# Feature Routes

```
GET    /api/v1/features
GET    /api/v1/features/:id
POST   /api/v1/features
PATCH  /api/v1/features/:id
DELETE /api/v1/features/:id
```

---

# Rule Routes

```
GET    /api/v1/rules
GET    /api/v1/rules/:id
POST   /api/v1/rules
PATCH  /api/v1/rules/:id
DELETE /api/v1/rules/:id
```

---

| Module                | Tenant | Landlord | Admin |
| --------------------- | ------ | -------- | ----- |
| Create Rental Request | ✅     | ❌       | ❌    |
| Create Property       | ❌     | ✅       | ✅    |
| Update Own Property   | ❌     | ✅       | ✅    |
| Manage Categories     | ❌     | ❌       | Admin |
| Manage Amenities      | ❌     | ❌       | Admin |
| Manage Features       | ❌     | ❌       | Admin |
| Manage Rules          | ❌     | ❌       | Admin |
| Make Payment          | ✅     | ✅       | ✅    |
| Write Review          | ✅     | ❌       | ❌    |

---

# Error Handling

Centralized error handling supports:

- Zod validation errors
- Prisma errors
- JWT errors
- Database errors
- Unknown server errors

Example:

```json
{
  "success": false,
  "message": "Validation failed",
  "timestamp": "2026-07-11T00:00:00.000Z"
}
```

---

# Future Improvements

- Email verification
- Password reset
- Property search
- Advanced filtering
- Image upload
- Notification system
- Chat system
- Admin dashboard
- Analytics

---

# Author

## Polas Chandra Barmon

Full stack Developer

---

# License

ISC License
