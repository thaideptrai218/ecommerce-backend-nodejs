# Codebase Summary

This document provides a high-level overview of the codebase, generated from the `repomix` compaction.

## Directory Structure and Key Components

The codebase is organized into logical directories, each serving a specific purpose:

- **`src/controllers/`**: Handles incoming requests, orchestrates data flow by calling services, and sends responses. Controllers are responsible for request validation, error handling, and formatting output.
- **`src/services/`**: Contains the core business logic of the application. Services encapsulate complex operations, interact with repositories to manage data, and apply business rules.
  - **`discount-service.ts`**: Manages discount-related operations, including creation, application, and validation of discounts.
  - **`cart-service.ts`**: Handles shopping cart functionalities, such as adding, updating, and removing items, and calculating totals.
  - **`comment-service.ts`**: Manages product comments, including creation, retrieval, and moderation.
- **`src/models/`**: Defines the data structures and interacts with the MongoDB database using Mongoose.
  - **`discount-model.ts`**: Defines the schema and model for discount documents in MongoDB.
  - **`src/models/repositories/`**: Abstraction layer for data access, providing a consistent API for interacting with models and the database.
    - **`sku.repo.ts`**: Manages CRUD operations for SKU (Stock Keeping Unit) data, interacting with `SkuModel`.
    - **`spu.repo.ts`**: Manages CRUD operations for SPU (Standard Product Unit) data, interacting with `SpuModel`.
- **`src/auth/`**: Manages authentication and authorization logic, including JWT token handling, password hashing, and permission checks.
- **`src/configs/`**: Contains configuration files for various environments and services.
- **`src/core/`**: Houses core functionalities and utilities used across the application.
- **`src/databases/`**: Manages database connections and configurations (e.g., MongoDB with Mongoose, Redis).
- **`src/helpers/`**: Offers helper functions to support various modules.
- **`src/loggers/`**: Implements logging mechanisms for tracking application events and errors.
- **`src/middleware/`**: Contains Express middleware functions for request processing (e.g., authentication, validation, error handling).
- **`src/rest/`**: Contains REST client configurations or helper functions for external API calls.
- **`src/routers/`**: Defines API routes and maps them to corresponding controller methods.
- **`src/uploads/`**: Handles file upload logic and storage.
- **`src/utils/`**: Provides general utility functions and helpers.

## SPU/SKU Implementation - Phase 1

This phase introduces the foundational models and repositories for managing Standard Product Units (SPU) and Stock Keeping Units (SKU), enabling a more granular and flexible product catalog.

### SPU Model (`src/models/spu.model.ts`)
The SPU (Standard Product Unit) model represents a generic product. It includes core product information and defines variations.

**Key Fields:**
- `product_id`: Unique identifier for the SPU (string).
- `product_name`: Name of the product.
- `product_thumb`: Thumbnail image URL.
- `product_description`: Detailed description.
- `product_slug`: URL-friendly slug, automatically generated from `product_name`.
- `product_price`: Base price or minimum price of the product.
- `product_category`: Array of strings defining the product's category hierarchy.
- `product_shop`: Reference to the shop (ObjectId).
- `product_attributes`: Flexible object for common product attributes.
- `product_variations`: Array of objects, each defining a variation type (e.g., "color", "size") and its options.
- `isDraft`, `isPublished`, `isDeleted`: Status flags.
- `createdAt`, `updatedAt`: Timestamps.

**Schema Details:**
- Uses Mongoose schema with `timestamps: true`.
- Includes a pre-save middleware to automatically generate `product_slug` from `product_name`.

### SKU Model (`src/models/sku.model.ts`)
The SKU (Stock Keeping Unit) model represents a specific, purchasable variant of an SPU. Each SKU is linked to an SPU and combines specific variation options.

**Key Fields:**
- `sku_id`: Unique identifier for the SKU (string).
- `sku_tier_idx`: Array of numbers mapping to the chosen options within the SPU's `product_variations` (e.g., `[0, 1]` might mean the first color option and the second size option).
- `sku_default`: Boolean indicating if this is the default SKU for the SPU.
- `sku_slug`: URL-friendly slug (e.g., 'iphone-15-midnight-256gb').
- `sku_sort`: Sorting order.
- `sku_price`: Price of this specific SKU.
- `sku_stock`: Inventory count for this SKU.
- `product_id`: Reference to the parent SPU's `product_id` (string).
- `isDraft`, `isPublished`, `isDeleted`: Status flags.
- `createdAt`, `updatedAt`: Timestamps.

**Schema Details:**
- Uses Mongoose schema with `timestamps: true`.
- Includes indexes on `sku_id` and `product_id` for efficient lookups.

### Relationship between SPU and SKU

- An SPU can have multiple SKUs.
- Each SKU represents a unique combination of the variations defined in its parent SPU.
- The `product_id` in the SKU model links it back to the SPU model.

This SPU/SKU structure allows for flexible product management, separating generic product information from specific purchasable variants and their inventory.

## Technology Stack

- **Runtime**: Node.js with TypeScript strict mode
- **Framework**: Express.js 5.x with helmet middleware
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT with bcrypt password hashing
- **Caching**: Redis
- **Containerization**: Docker
- **Security**: CORS, compression, helmet security headers

## Architecture Patterns

- **Factory Pattern**: Utilized for product types.
- **Repository Pattern**: Abstracted data access for cleaner service logic, now including `SkuRepository` and `SpuRepository`.
- **Service Layer**: Encapsulates business logic, making it reusable and testable.
- **Middleware Pattern**: For authentication and validation, enabling modular and chainable request processing.

This structured approach ensures maintainability, scalability, and adherence to enterprise-level software development best practices.