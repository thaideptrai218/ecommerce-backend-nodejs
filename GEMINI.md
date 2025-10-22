# GEMINI.md

## Project Overview

This project is a Node.js e-commerce backend application built with Express.js and TypeScript. It uses MongoDB as its database and provides RESTful APIs for handling various e-commerce functionalities. Key features include user authentication with JWT, data persistence with Mongoose, and a structured approach to routing, controllers, and services.

### Technologies

*   **Backend:** Node.js, Express.js, TypeScript
*   **Database:** MongoDB
*   **Authentication:** JSON Web Tokens (JWT)
*   **Linting:** ESLint

## Building and Running

### Prerequisites

*   Node.js
*   Docker (for running the MongoDB database)

### Running the Application

1.  **Start the database:**
    ```bash
    docker-compose up -d
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    *TODO: A `dev` script is missing from `package.json`. Based on the project's dependencies, the command should be `tsx server.ts`.*

4.  **Run the production server:**
    ```bash
    npm start
    ```

### Building the Application

The project is set up for type checking with TypeScript, but not for emitting compiled JavaScript files. To check for type errors, run:

```bash
npx tsc
```

## Development Conventions

*   **Coding Style:** The project uses ESLint for code linting. Run `npx eslint .` to check for linting errors.
*   **Testing:** There are no tests configured for this project.
*   **Directory Structure:** The source code is located in the `src` directory, with a clear separation of concerns between routes, controllers, services, models, and other components.
