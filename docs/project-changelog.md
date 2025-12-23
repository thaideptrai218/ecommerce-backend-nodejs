# Project Changelog

## 2025-12-23 - SPU/SKU Implementation - Phase 1

**New Features:**
- Introduced Standard Product Unit (SPU) and Stock Keeping Unit (SKU) models for granular product management.
- Implemented `SpuRepository` and `SkuRepository` for data access operations related to SPU and SKU.

**Details:**
- **SPU Model (`src/models/spu.model.ts`):** Defines generic product information and variations.
- **SKU Model (`src/models/sku.model.ts`):** Represents specific, purchasable variants linked to an SPU, managing price, stock, and unique attributes.
- **Repositories:** `src/models/repositories/spu.repo.ts` and `src/models/repositories/sku.repo.ts` provide methods for creating, retrieving, updating, and managing SPU and SKU data.

This update lays the foundation for a flexible and scalable product catalog system, allowing for detailed product variations and inventory tracking.