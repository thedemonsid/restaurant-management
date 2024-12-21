import path from "path";
import { app } from "electron";
import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import { isDev } from "../utils.js";
import type { MenuItem } from "./types.ts";

class RestaurantDB {
  private db: DatabaseType | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = isDev()
      ? path.join(app.getAppPath(), "src/electron/database/restaurant.db")
      : path.join(app.getPath("userData"), "restaurant.db");

    this.init();
  }

  private init(): void {
    try {
      this.db = new Database(this.dbPath);
      this.db.pragma("journal_mode = WAL");
      this.db.pragma("foreign_keys = ON");

      this.createTables();
      this.ensureDefaultCategory();
    } catch (error) {
      console.error("Database initialization error:", error);
      throw error;
    }
  }

  private createTables(): void {
    const schema = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
    `;

    this.db?.exec(schema);
  }

  private ensureDefaultCategory(): void {
    const stmt = this.db?.prepare(`
      INSERT OR IGNORE INTO categories (name) VALUES ('Default')
    `);
    stmt?.run();
  }

  public addMenuItem(
    item: Omit<MenuItem, "id" | "created_at" | "is_available">
  ) {
    const stmt = this.db?.prepare(`
      INSERT INTO menu_items (category_id, name, price, description)
      VALUES (@categoryId, @name, @price, @description)
    `);

    return stmt?.run({
      categoryId: item.category_id,
      name: item.name,
      price: item.price,
      description: item.description,
    });
  }

  public getMenuItems() {
    const stmt = this.db?.prepare(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m 
      LEFT JOIN categories c ON m.category_id = c.id
    `);
    return stmt?.all() as (MenuItem & { category_name: string })[];
  }

  public getCategories() {
    const stmt = this.db?.prepare(`
      SELECT * FROM categories
    `);
    return stmt?.all();
  }

  public close(): void {
    this.db?.close();
  }
}

export default new RestaurantDB();
