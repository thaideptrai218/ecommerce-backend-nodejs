# Codebase Summary

This document provides an overview of the codebase structure and key components of the E-commerce Backend project. The project follows an enterprise-level architecture with clear separation of concerns, utilizing Factory, Repository, and Service patterns.

## Directory Structure and Key Components

The codebase is organized into logical directories, each serving a specific purpose:

- **`src/controllers/`**: Handles incoming requests, orchestrates data flow by calling services, and sends responses. Controllers are responsible for request validation, error handling, and formatting output.
- **`src/services/`**: Contains the core business logic of the application. Services encapsulate complex operations, interact with repositories to manage data, and apply business rules.
  - **`discount-service.ts`**: (3,836 tokens) Manages discount-related operations, including creation, application, and validation of discounts.
  - **`cart-service.ts`**: (2,266 tokens) Handles shopping cart functionalities, such as adding, updating, and removing items, and calculating totals.
  - **`comment-service.ts`**: (1,577 tokens) Manages product comments, including creation, retrieval, and moderation.
- **`src/models/`**: Defines the data structures and interacts with the MongoDB database using Mongoose.
  - **`discount-model.ts`**: (1,698 tokens) Defines the schema and model for discount documents in MongoDB.
  - **`src/models/repositories/`**: Abstraction layer for data access, providing a consistent API for interacting with models and the database.
- **`src/auth/`**: Manages authentication and authorization logic, including JWT token handling, password hashing, and permission checks.
- **`src/configs/`**: Contains configuration files for various environments and services.
- **`src/core/`**: Houses core functionalities and utilities used across the application.
- **`src/databases/`**: Manages database connections and configurations (e.g., MongoDB with Mongoose, Redis).
- **`src/loggers/`**: Implements logging mechanisms for tracking application events and errors.
- **`src/middleware/`**: Contains Express middleware functions for request processing (e.g., authentication, validation, error handling).
- **`src/rest/`**: Likely contains REST client configurations or helper functions for external API calls.
- **`src/routers/`**: Defines API routes and maps them to corresponding controller methods.
- **`src/uploads/`**: Handles file upload logic and storage.
- **`src/utils/`**: Provides general utility functions and helpers.
- **`src/helpers/`**: Offers helper functions to support various modules.

## Technology Stack

- **Runtime**: Node.js with TypeScript strict mode
- **Framework**: Express.js 5.x with helmet middleware
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT with bcrypt password hashing
- **Caching**: Redis
- **Containerization**: Docker
- **Security**: CORS, compression, helmet security headers

## Architecture Patterns

- **Factory Pattern**: Utilized for product types (e.g., `ProductFactory` in `product-service.ts`).
- **Repository Pattern**: Abstracted data access for cleaner service logic.
- **Service Layer**: Encapsulates business logic, making it reusable and testable.
- **Middleware Pattern**: For authentication and validation, enabling modular and chainable request processing.

This structured approach ensures maintainability, scalability, and adherence to enterprise-level software development best practices.