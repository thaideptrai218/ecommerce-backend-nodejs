# E-commerce Backend Project

This repository contains the backend for an e-commerce application, built with Node.js and TypeScript. It follows an enterprise-level architecture with clear separation of concerns, utilizing Factory, Repository, and Service patterns to ensure scalability, maintainability, and extensibility.

## Features

- User Authentication & Authorization (JWT, RBAC, API Key)
- Product Management (CRUD, Factory Pattern for product types)
- Shopping Cart Functionality
- Discount Management
- Comment System
- Robust Error Handling
- Comprehensive Security Measures
- Redis Caching

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript (strict mode enabled)
- **Web Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Caching**: Redis
- **Security**: Helmet, CORS, compression
- **Containerization**: Docker

## Setup Instructions

### Prerequisites

- Node.js (LTS version recommended)
- Docker & Docker Compose
- MongoDB (running via Docker or locally)
- Redis (running via Docker or locally)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-backend-nodejs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`.
Ensure you configure your MongoDB connection string, JWT secrets, and other necessary environment variables.

### 4. Database Setup

The project uses MongoDB and Redis. You can set them up using Docker Compose:

```bash
docker-compose up -d
```

This will start MongoDB and Redis instances in the background.

### 5. Running the Application

#### Development with Hot Reload (Recommended)

```bash
npx tsx watch server.ts
```

This command will start the server with automatic restarts on code changes. The application will be accessible on `http://localhost:3055`.

#### Production Build

```bash
npm start
```

This compiles the TypeScript code and starts the application. The application will be accessible on `http://localhost:3055`.

### 6. Linting

To check code quality and adherence to styling rules:

```bash
npx eslint .
```

### 7. Testing (Planned)

Currently, tests are not implemented, but the framework is in place. When implemented, you can run tests using:

```bash
npm test
```

## Documentation

For detailed information about the project, refer to the following documentation:

- [Project Overview and PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)