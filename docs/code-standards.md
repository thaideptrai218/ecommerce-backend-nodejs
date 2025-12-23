# Code Standards

This document outlines the coding standards and best practices for the E-commerce Backend project, ensuring consistency, maintainability, and high code quality. These standards are derived from `CLAUDE.md` and industry best practices for Node.js and TypeScript development.

## 1. Codebase Structure

The project adheres to a strict layered architecture to promote separation of concerns and modularity.

```
Controllers (src/controllers/) → Services (src/services/) → Repositories (src/models/repositories/) → Models (src/models/)
```

- **Controllers (`src/controllers/`)**:
    - Responsible for handling incoming HTTP requests.
    - Orchestrates the data flow by calling appropriate service methods.
    - Performs request validation and error handling.
    - Formats and sends HTTP responses.
    - Should be thin, focusing on request/response handling, not business logic.
- **Services (`src/services/`)**:
    - Contains the core business logic of the application.
    - Interacts with repositories to perform data operations.
    - Applies business rules and orchestrates complex operations involving multiple data entities.
    - Should expose static methods for business logic.
- **Repositories (`src/models/repositories/`)**:
    - Provides an abstraction layer for data access.
    - Encapsulates database interactions, acting as an intermediary between services and models.
    - Should define methods for CRUD operations and complex queries on specific entities.
- **Models (`src/models/`)**:
    - Defines the data schemas and interacts directly with the MongoDB database using Mongoose ODM.
    - Represents the structure and behavior of data entities.

## 2. Design Patterns

The following design patterns are mandatorily used:

- **Factory Pattern**: Used for creating instances of complex objects or families of related objects.
    - Example: `ProductFactory` for handling different product types (e.g., in `product-service.ts:94-116`).
- **Repository Pattern**: Abstracted data access to decouple the business logic from the data layer.
- **Service Layer**: Encapsulates business logic in static methods, making it reusable and testable.
- **Middleware Pattern**: Utilized for cross-cutting concerns like authentication, authorization, and validation, allowing for modular and chainable request processing.

## 3. Naming Conventions

Consistency in naming conventions is crucial for code readability and navigability.

- **Files**: `kebab-case` (e.g., `product-service.ts`, `user-controller.ts`).
- **Classes**: `PascalCase` (e.g., `ProductService`, `UserController`).
- **Functions/Methods**: `camelCase` with descriptive names (e.g., `getProductById`, `createUser`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PAGE_SIZE`, `API_KEY`).
- **Models**: `Schema` suffix (e.g., `ShopModel`, `ProductSchema`).

## 4. TypeScript Requirements

TypeScript is fundamental to this project, enforcing strong typing and improving code reliability.

- **Strict Mode**: Must be enabled in `tsconfig.json` without exceptions.
- **Return Types**: All functions and methods must explicitly define their return types.
- **MongoDB IDs**: Use `Types.ObjectId` for all MongoDB document IDs.
- **Interfaces**: Prefer `interface` over `type` for defining object shapes.
- **Immutability**: Use the `readonly` keyword for immutable data properties where applicable.

## 5. Error Handling Standards

A consistent and robust error handling mechanism is implemented.

- **Custom Error Classes**: Extend from a base `ErrorResponse` class for standardized error structures.
- **Global Error Middleware**: Catches and processes all application errors, ensuring a consistent error response format to clients.
- **HTTP Status Codes**: Utilize `http-status-codes` for semantically correct HTTP status codes in responses.
- **No Internal Details**: Never expose internal error details, stack traces, or sensitive information to clients in production environments.

## 6. Code Quality Standards

Code quality is enforced through specific metrics and practices.

- **Cyclomatic Complexity**: Functions should have a cyclomatic complexity of less than 10.
- **Function Length**: Functions should ideally be less than 50 lines of code.
- **File Length**: Files should generally be less than 300 lines; prefer keeping them under 200 lines for better readability and focus.
- **Test Coverage**: When tests are implemented, a minimum of 80% test coverage is required.

## 7. Security Best Practices

Security is paramount and integrated into every layer of the application.

- **Input Validation & Sanitization**: All incoming data must be validated and sanitized to prevent injection attacks and data corruption.
- **Parameterized Queries**: Mongoose handles parameterized queries by default, preventing SQL injection-like vulnerabilities.
- **Rate Limiting**: Implement rate limiting for API endpoints to prevent abuse and denial-of-service attacks.
- **No Logging of Sensitive Data**: Sensitive information (passwords, API keys) must never be logged.
- **Dependency Updates**: Regular updates of all project dependencies to mitigate known vulnerabilities.

## 8. Documentation Requirements

Comprehensive documentation is maintained to support development and maintenance.

- **Inline Comments**: Use inline comments for complex business logic, edge cases, or non-obvious code sections.
- **JSDoc**: All public methods, functions, and interfaces should be documented using JSDoc comments.
- **README**: A concise `README.md` provides project overview, setup instructions, and links to detailed documentation.
- **API Documentation**: All API endpoints should have clear and up-to-date documentation.

## 9. Git Workflow

Adherence to the defined Git workflow ensures a structured and collaborative development process.

- **Branch Strategy**:
    - `main`: Production-ready code.
    - `develop`: Integration branch for all features.
    - `feature/*`: For individual feature development.
    - `hotfix/*`: For emergency production bug fixes.
- **Commit Standards**:
    - **Extreme Concision**: Commit messages should be brief and to the point (e.g., "feat: add product search").
    - **Conventional Commits**: Follow the `type(scope): description` format (e.g., `feat(auth): add JWT refresh`).
    - **Signed Commits**: Required for sensitive changes.
    - **PR References**: Include relevant Pull Request references in commit messages when applicable.
- **Code Review Process**:
    - All code changes require a review before merging into `develop` or `main`.
    - Automated checks (linting, build) must pass.
    - Security reviews are mandatory for all authentication and authorization-related changes.
    - Performance reviews for database-intensive operations.

By following these code standards, we aim to build a high-quality, secure, and maintainable e-commerce backend system.