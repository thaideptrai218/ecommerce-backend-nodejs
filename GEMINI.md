# GEMINI.md

## Project Overview

This project is a Node.js e-commerce backend application built with Express.js and TypeScript. It uses MongoDB as its database and provides a RESTful API for managing shops and authentication. The authentication system is based on JSON Web Tokens (JWT) with a refresh token mechanism.

**Key Technologies:**

*   **Backend:** Node.js, Express.js, TypeScript
*   **Database:** MongoDB
*   **Authentication:** JSON Web Tokens (JWT)
*   **Linting:** ESLint

## Building and Running

**1. Installation:**

```bash
npm install
```

**2. Running the Application:**

```bash
npm start
```

The application will start on port 3055 by default.

**3. Running in Development:**

The `package.json` does not have a `dev` script. You can run the application in development mode with `tsx` for automatic restarts on file changes:

```bash
npx tsx watch server.ts
```

**4. Testing:**

The `package.json` does not have a `test` script.

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
},
```

## Development Conventions

*   **Coding Style:** The project uses ESLint for code linting. The configuration can be found in the `eslint.config.mts` file.
*   **Branching:** The project is in a Git repository, but there are no specific branching conventions mentioned.
*   **Committing:** There are no specific commit message conventions mentioned.
*   **Testing:** There are no tests in the project.

```