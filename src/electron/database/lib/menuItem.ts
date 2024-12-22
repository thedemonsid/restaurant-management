import type { Database as DatabaseType } from "better-sqlite3";
import type { MenuItem } from "../types.js";

export function addMenuItem(
  db: DatabaseType,
  item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
) {
  const stmt = db.prepare(`
    INSERT INTO "MenuItem" (name, price)
    VALUES (@name, @price)
  `);

  stmt.run({
    name: item.name,
    price: item.price,
  });
  const response: Omit<MenuItem, "id" | "createdAt" | "updatedAt"> = {
    name: item.name,
    price: item.price,
  };
  return response;
}

export function getMenuItems(db: DatabaseType) {
  const stmt = db.prepare(`
    SELECT * FROM "MenuItem"
  `);
  return stmt.all() as MenuItem[];
}

export function updateMenuItem(db: DatabaseType, item: MenuItem) {
  const stmt = db.prepare(`
    UPDATE "MenuItem"
    SET name = @name, price = @price
    WHERE id = @id
  `);

  return stmt.run({
    id: item.id,
    name: item.name,
    price: item.price,
  });
}

export function deleteMenuItem(db: DatabaseType, id: number) {
  const stmt = db.prepare(`
    DELETE FROM "MenuItem"
    WHERE id = @id
  `);

  return stmt.run({ id });
}
