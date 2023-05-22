# E-Commerce APIs

## How to Run Locally

### Run the server

```bash
yarn start
```

### Run the server (dev)

```bash
yarn dev
```

## How to Run in Production

* Server is hosted on Railway (https://e-commerce-apis-production.up.railway.app/)

* API Documentation is hosted on
  Postman (https://elements.getpostman.com/redirect?entityId=26690439-a3d8ae62-5c8b-4b58-b59e-398bb8be16e2&entityType=collection)

## Technologies Used

* Node.js
* Express.js
* JWT Authentication
* PostgreSQL
* Prisma
* Railway
* Postman

## Database Schema

```sql
   +--------------+
   |     User     |
   +--------------+
   | id: Int      |
   | name: String |
   | email: String|
   | password: String |
   | createdAt: DateTime |
   | updatedAt: DateTime |
   +--------------+
         |
         |
   +--------------+
   |   Product    |
   +--------------+
   | id: Int      |
   | name: String |
   | description: String |
   | price: Int   |
   | authorId: Int (User.id) |
   | createdAt: DateTime |
   | updatedAt: DateTime |
   +--------------+
         |
         |
   +--------------+
   |   Variant    |
   +--------------+
   | id: Int      |
   | name: String |
   | sku: String  |
   | additionalCost: Int |
   | stock: Int   |
   | productId: Int (Product.id) |
   | createdAt: DateTime |
   | updatedAt: DateTime |
   +--------------+
         |
         |
   +--------------+
   |    Order     |
   +--------------+
   | id: Int      |
   | status: String |
   | totalCost: Int |
   | customerId: Int (User.id) |
   | createdAt: DateTime |
   | updatedAt: DateTime |
   +--------------+
         |
         |
   +-------------------+
   |    OrderProduct   |
   +-------------------+
   | orderId: Int (Order.id) |
   | variantId: Int (Variant.id) |
   +-------------------+
```

### The relationships between the tables are as follows:

- User has a one-to-many relationship with Product and Order. The authorId field in the Product table references the id
  field in the User table, representing the author of the product. The customerId field in the Order table references
  the id field in the User table, representing the customer who placed the order.

- Product has a many-to-one relationship with User. The authorId field in the Product table references the id field in
  the User table, indicating the author of the product.

- Product has a one-to-many relationship with Variant. The productId field in the Variant table references the id field
  in the Product table, associating a variant with its corresponding product.

- Variant has a many-to-one relationship with Product. The productId field in the Variant table references the id field
  in the Product table, indicating the product to which the variant belongs.

- Order has a many-to-one relationship with User. The customerId field in the Order table references the id field in the
  User table, representing the customer who placed the order.

- Order has a many-to-many relationship with Variant through the OrderProduct table. The orderId field in the
  OrderProduct table references the id field in the Order table, and the variantId field in the OrderProduct table
  references the id field in the Variant table. This association allows multiple variants to be associated with a single
  order, and vice versa.