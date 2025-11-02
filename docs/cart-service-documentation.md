# Cart Service Documentation

## Overview
The `CartService` class handles all shopping cart operations for the e-commerce backend. It manages product additions, quantity updates, and cart retrieval for users.

## Architecture
- **Service Layer**: Static methods for cart operations
- **Data Access**: Direct MongoDB operations via Mongoose
- **Error Handling**: Uses custom error responses
- **Dependencies**: CartModel, ProductRepository, ShopModel

## Methods Documentation

### 1. `createUserCart({ userId, product })`
**Purpose**: Creates a new cart for a user or adds product to existing active cart.

**Parameters**:
- `userId`: User identifier
- `product`: Product object to add to cart

**Returns**: Updated cart document

**Logic**:
- Uses `findOneAndUpdate` with `upsert: true`
- Adds product to `cart_products` array using `$addToSet`
- Ensures no duplicate products in single operation

**Use Case**: First-time cart creation or when user has no active cart

### 2. `updateUserCartQuantity({ userId, product })`
**Purpose**: Increments or decrements quantity of existing product in cart.

**Parameters**:
- `userId`: User identifier
- `product`: Object with `productId` and `quantity` (can be negative)

**Returns**: Updated cart with new quantity

**Logic**:
- Finds cart containing specific product ID
- Uses `$inc` operator to modify quantity
- Atomic operation prevents race conditions

**Use Case**: When user changes quantity of item already in cart

### 3. `addToCart({ userId, product })`
**Purpose**: Main method for adding products to cart with intelligent handling.

**Parameters**:
- `userId`: User identifier
- `product`: Product object to add

**Returns**: Updated cart

**Logic Flow**:
1. **Check for existing cart**: Finds cart by `userId`
2. **No cart found**: Creates new cart with product
3. **Cart exists**: Checks if product already exists
4. **Product exists**: Updates quantity using `updateUserCartQuantity`
5. **Product new**: Adds to cart using `$push`

**Use Case**: Standard "Add to Cart" functionality

### 4. `addToCartV2({ userId, product })`
**Purpose**: Enhanced cart addition with shop validation (INCOMPLETE).

**Current Issues**:
- References undefined `shop_order_ids` variable
- Incomplete logic for quantity = 0 case
- Missing proper error handling

**Intended Logic**:
- Validate product belongs to specified shop
- Handle quantity changes including removal
- More secure than basic `addToCart`

**Status**: ⚠️ **Needs Implementation**

### 5. `deleteUserCart({ userId, productId })`
**Purpose**: Removes specific product from user's cart.

**Parameters**:
- `userId`: User identifier
- `productId`: Product to remove

**Returns**: Update result

**Logic**:
- Uses `$pull` operator to remove product from array
- Only affects active carts (`cart_state: 'active'`)

**Use Case**: When user removes item from cart

### 6. `getListUserCart({ userId })`
**Purpose**: Retrieves user's cart with all products.

**Parameters**:
- `userId`: User identifier

**Returns**: Cart document (lean format for performance)

**Logic**:
- Finds cart by user ID
- Uses `.lean()` for better performance
- Returns entire cart structure

**Use Case**: Display cart contents to user

## Data Structures

### Cart Product Object
```javascript
{
  productId: ObjectId,     // Reference to Product
  // ... other product fields
  quantity: Number         // Amount in cart
}
```

### Cart Document Structure
```javascript
{
  cart_userId: ObjectId,
  cart_state: String,      // "active", "completed", "failed", "pending"
  cart_products: Array,    // Array of product objects
  cart_count_product: Number,
  timestamps: true
}
```

## Current Limitations

1. **No Variant Support**: Cannot handle different sizes/colors of same product
2. **No Inventory Validation**: Doesn't check if products are in stock
3. **No Price Validation**: Doesn't verify current product prices
4. **Basic Error Handling**: Limited validation and error scenarios
5. **Incomplete Methods**: `addToCartV2` needs completion
6. **No Bulk Operations**: Cannot add multiple items at once
7. **No Cart Merging**: Cannot merge guest cart to user cart

## Usage Examples

### Adding Product to Cart
```javascript
const result = await CartService.addToCart({
  userId: "user123",
  product: {
    productId: "prod456",
    quantity: 2,
    // ... other product fields
  }
});
```

### Updating Quantity
```javascript
const result = await CartService.updateUserCartQuantity({
  userId: "user123",
  product: {
    productId: "prod456",
    quantity: -1  // Decrease by 1
  }
});
```

### Removing Product
```javascript
const result = await CartService.deleteUserCart({
  userId: "user123",
  productId: "prod456"
});
```

### Getting User Cart
```javascript
const cart = await CartService.getListUserCart({
  userId: "user123"
});
```

## Recommended Improvements

1. **Fix `addToCartV2`**: Complete implementation with proper validation
2. **Add Inventory Checks**: Verify product availability before adding
3. **Implement Variants**: Support for size, color, etc.
4. **Add Bulk Operations**: Multiple product operations in single request
5. **Enhanced Error Handling**: More specific error types and messages
6. **Performance Optimization**: Add indexes and caching for frequently accessed carts