import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import { isDev } from "../../utils.js";
import { schema } from "../schema/index.js";

export function initDatabase() {
  const dbPath = isDev()
    ? path.join(app.getAppPath(), "src/electron/database/restaurant.db")
    : path.join(app.getPath("userData"), "restaurant.db");

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(schema);

  return db;
}
