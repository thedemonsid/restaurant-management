export const schema = `
  CREATE TABLE IF NOT EXISTS "MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tableName" TEXT,
    "isParcel" BOOLEAN NOT NULL DEFAULT FALSE,
    "amountPaid" REAL NOT NULL DEFAULT 0.0,
    "paymentMethod" TEXT NOT NULL CHECK ("paymentMethod" IN ('cash', 'card', 'online')),
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- Join table to link MenuItems and Orders
  CREATE TABLE IF NOT EXISTS "OrderMenuItem" (
    "order_id" INTEGER NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    CONSTRAINT "OrderMenuItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderMenuItem_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "MenuItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  -- Unique index to ensure each MenuItem can only be linked once per Order
  CREATE UNIQUE INDEX IF NOT EXISTS "OrderMenuItem_order_menu_item_unique" ON "OrderMenuItem"("order_id", "menu_item_id");

  -- Index to speed up lookups by order_id
  CREATE INDEX IF NOT EXISTS "OrderMenuItem_order_id_index" ON "OrderMenuItem"("order_id");

  -- Index to speed up lookups by menu_item_id
  CREATE INDEX IF NOT EXISTS "OrderMenuItem_menu_item_id_index" ON "OrderMenuItem"("menu_item_id");
`;

//! model MenuItem {
//!   id        Int      @id @default(autoincrement())
//!   name      String   @unique
//!   price     Float
//!   createdAt DateTime @default(now())
//!   updatedAt DateTime @updatedAt
//!   orders    Order[]
//! }

//!  model Order {
//!  id Int @id @default(autoincrement())

//!  tableName String?
//!  isParcel  Boolean

//!  amountPaid    Float  @default(0)
//!  paymentMethod String

//!  createdAt DateTime @default(now())
//!  updatedAt DateTime @updatedAt

//!   items MenuItem[]
//! }
