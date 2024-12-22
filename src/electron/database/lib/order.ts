import type { Database as DatabaseType } from "better-sqlite3";
import type { Order } from "../types.js";

export function addOrder(
  db: DatabaseType,
  order: Omit<Order, "id" | "createdAt" | "updatedAt">,
  orderedItems: { menu_item_id: number; quantity: number }[]
) {
  const orderStmt = db.prepare(`
    INSERT INTO "Order" (tableName, isParcel, amountPaid, paymentMethod)
    VALUES (@tableName, @isParcel, @amountPaid, @paymentMethod)
  `);

  const orderItemsStmt = db.prepare(`
    INSERT INTO "OrderMenuItem" (order_id, menu_item_id, quantity)
    VALUES (@order_id, @menu_item_id, @quantity)
  `);

  const transaction = db.transaction(() => {
    const result = orderStmt.run({
      tableName: order.tableName,
      isParcel: order.isParcel,
      amountPaid: order.amountPaid,
      paymentMethod: order.paymentMethod,
    });

    const orderId = result.lastInsertRowid;

    orderedItems.forEach((item) => {
      orderItemsStmt.run({
        order_id: orderId,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
      });
    });
  });

  transaction();
  return true;
}

export function getOrders(db: DatabaseType) {
  const stmt = db.prepare(`
    SELECT * FROM "Order"
  `);
  return stmt.all() as Order[];
}

export function getOrderItems(db: DatabaseType, orderId: number) {
  const stmt = db.prepare(`
    SELECT oi.*, mi.name, mi.price
    FROM "OrderMenuItem" oi
    JOIN "MenuItem" mi ON oi.menu_item_id = mi.id
    WHERE oi.order_id = @order_id
  `);
  return stmt.all({ order_id: orderId });
}
