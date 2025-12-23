# System Architecture

This document describes the overall system architecture of the E-commerce Backend, focusing on its layered structure, design patterns, and how different components interact. The architecture is designed to be enterprise-level, promoting modularity, scalability, and maintainability.

## 1. Layered Architecture

The application is structured into distinct layers, each with specific responsibilities, ensuring a clear separation of concerns. The flow of control generally moves in one direction:

```
Controllers (Presentation Layer)
      ↓
Services (Business Logic Layer)
      ↓
Repositories (Data Access Layer)
      ↓
Models (Data Layer - interacting with MongoDB)
```

### 1.1. Controllers (`src/controllers/`)

- **Role**: Act as the entry point for incoming HTTP requests. They are part of the Presentation Layer.
- **Responsibilities**:
    - Parse request parameters, headers, and body.
    - Validate input data before passing it to the service layer.
    - Call appropriate methods in the Service layer to execute business logic.
    - Handle errors returned by the Service layer and format them into appropriate HTTP responses.
    - Serialize response data into JSON or other formats.
- **Characteristics**: Controllers are kept "thin," meaning they contain minimal business logic and primarily focus on coordinating between the HTTP request/response cycle and the Service layer.

### 1.2. Services (`src/services/`)

- **Role**: Contain the core business logic and orchestrate complex operations. This is the Business Logic Layer.
- **Responsibilities**:
    - Implement the specific business rules and workflows of the application.
    - Interact with one or more Repositories to fetch, manipulate, and store data.
    - Perform data transformations and validations that are specific to the business domain.
    - Can call other services to achieve complex tasks.
    - Encapsulate the "how" of the business operations, abstracting it from the controllers.
- **Characteristics**: Services are designed to be reusable and testable. They typically expose static methods for common operations.

### 1.3. Repositories (`src/models/repositories/`)

- **Role**: Provide an abstraction layer over the data persistence mechanism. This is the Data Access Layer.
- **Responsibilities**:
    - Encapsulate the logic required to access data sources (e.g., MongoDB).
    - Provide methods for common CRUD (Create, Read, Update, Delete) operations on specific entities.
    - Map domain objects to database records and vice-versa.
    - Decouple the Service layer from the underlying database technology.
- **Characteristics**: Repositories abstract away the details of the database, allowing services to interact with data in a domain-centric manner.

### 1.4. Models (`src/models/`)

- **Role**: Define the structure and behavior of data entities, directly interacting with the MongoDB database via Mongoose. This is the Data Layer.
- **Responsibilities**:
    - Define Mongoose schemas, specifying data types, validations, and relationships.
    - Provide methods for interacting with the MongoDB collection.
    - Handle database-specific concerns like indexing and pre/post-save hooks.
- **Characteristics**: Models represent the actual data structure stored in the database.

## 2. Design Patterns

The architecture heavily leverages several key design patterns:

### 2.1. Factory Pattern

- **Usage**: Primarily used for creating instances of different product types.
- **Example**: A `ProductFactory` (as indicated in `product-service.ts:94-116`) would be responsible for creating specific product objects (e.g., electronic products, clothing products) based on a given type, abstracting the instantiation logic.

### 2.2. Repository Pattern

- **Usage**: Provides a clear separation between the business logic and the data access logic.
- **Benefits**:
    - **Testability**: Services can be tested independently of the database by mocking repositories.
    - **Maintainability**: Changes in the database schema or technology only affect the repository layer.
    - **Flexibility**: Easily switch database technologies without altering business logic.

### 2.3. Service Layer Pattern

- **Usage**: Centralizes the business logic, making it consistent and reusable across different controllers or other services.
- **Benefits**:
    - **Modularity**: Business rules are encapsulated and easy to locate.
    - **Transaction Management**: Can manage transactions spanning multiple data operations.
    - **Security**: Centralized enforcement of authorization rules.

### 2.4. Middleware Pattern

- **Usage**: For handling cross-cutting concerns that apply to multiple routes or operations.
- **Examples**:
    - **Authentication Middleware**: Verifies API keys, JWT tokens, and client IDs (`x-api-key`, `x-client-id`, `authorization` headers).
    - **Authorization Middleware**: Checks user roles and permissions (RBAC).
    - **Validation Middleware**: Ensures incoming request data conforms to expected schemas.
    - **Logging Middleware**: Records request details.
    - **Security Middleware**: `helmet` for setting various HTTP headers for security.

## 3. Technology Stack Integration

- **Node.js & TypeScript**: The entire application is built with Node.js and strictly typed using TypeScript, ensuring type safety and code quality.
- **Express.js**: Serves as the web framework, handling routing and request/response cycles.
- **MongoDB & Mongoose**: MongoDB is the primary data store, with Mongoose providing an ODM for schema definition, validation, and interaction.
    - **Shop-based Data Isolation**: Data is often scoped to a `shop` entity, ensuring multi-tenancy support.
    - **Text Indexing**: Utilized for efficient product search capabilities.
    - **Draft/Published Workflow**: Implemented at the model level for managing content lifecycle.
    - **Automatic Slug Generation**: For SEO-friendly URLs.
- **Redis**: Integrated for caching frequently accessed data, reducing database load and improving response times.
- **JWT & bcrypt**: JSON Web Tokens for authentication and `bcrypt` for secure password hashing.

## 4. Security Architecture

Security is built into the architecture through multiple layers:

1.  **API Key Validation**: All endpoints are protected by an `x-api-key` header.
2.  **Permission System**: Role-based access control (RBAC) ensures users only access resources they are authorized for.
3.  **JWT Authentication**: Access tokens provide secure, stateless authentication, with refresh token rotation for enhanced security.
4.  **Token Security**: Unique per-user secret keys are used for signing JWTs, making tokens more resilient to attacks.
5.  **Middleware**: Security middleware (e.g., `helmet`, CORS, compression) adds additional layers of protection.
6.  **Input Validation**: Strict input validation prevents common web vulnerabilities.

This comprehensive architectural approach ensures that the E-commerce Backend is not only functional and performant but also secure, scalable, and easy to maintain over time.