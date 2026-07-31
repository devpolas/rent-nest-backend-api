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

[REPOSITORY](https://github.com/devpolas/rent-nest-backend-api.git)

## Live API

[LIVE](https://renttnest-api.vercel.app)

## ERD Diagram

[ERD](https://github.com/devpolas/rent-nest-backend-api/blob/main/ERD.md)

## API Documentation

[DOCUMENTATION](https://pcb951-s-team.docs.buildwithfern.com/rent-nest/health)

---

# ✨ Features

- 🔐 JWT Authentication
- 🍪 HTTP-only Cookie Authentication
- 👥 Role-based Authorization
- 🏡 Property Management
- 📝 Rental Request Workflow
- 💳 Stripe Payment Integration
- ⭐ Review System
- 📍 Location Management
- 🌐 Social Profiles
- ✅ Zod Validation
- 🗄 Prisma ORM
- 🐘 PostgreSQL
- ⚠ Centralized Error Handling

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

---

# 📂 Project Structure

```text
src
├── config
├── lib
├── middlewares
├── modules
├── routes
├── utils
├── app.ts
└── server.ts
```

---

# ⚙️ Installation

```bash
git clone https://github.com/devpolas/rent-nest-backend-api.git
cd rent-nest-backend-api
npm install
```

---

# 🔐 Environment Variables

[ENV](https://github.com/devpolas/rent-nest-backend-api/blob/main/sample_env)

---

# Development

```bash
npm run dev
```

# Production

```bash
npm run build
npm start
```

---

# 📚 API

Base URL

```text
/api/v1
```

Modules:

- Auth
- Users
- Properties
- Rental Requests
- Payments
- Reviews
- Categories
- Amenities
- Features
- Rules
- Locations
- Social Profiles

---

# Error Handling

Supports:

- Zod Errors
- Prisma Errors
- JWT Errors
- Validation Errors
- Unknown Errors

---

# Author

**Polas Chandra Barmon**

Full Stack Developer

---

# License

ISC License
