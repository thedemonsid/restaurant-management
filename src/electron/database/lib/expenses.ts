import type { Database as DatabaseType } from "better-sqlite3";
import type { Expense } from "../types.js";

export function addExpense(
  db: DatabaseType,
  expense: Omit<Expense, "id" | "createdAt" | "updatedAt">
) {
  const stmt = db.prepare(`
    INSERT INTO "Expenses" (name, price, doneBy)
    VALUES (@name, @price, @doneBy)
  `);

  stmt.run({
    name: expense.name,
    price: expense.price,
    doneBy: expense.doneBy,
  });

  const response: Omit<Expense, "id" | "createdAt" | "updatedAt"> = {
    name: expense.name,
    price: expense.price,
    doneBy: expense.doneBy,
  };
  return response;
}

export function getExpenses(db: DatabaseType) {
  const stmt = db.prepare(`
    SELECT * FROM "Expenses"
  `);
  return stmt.all() as Expense[];
}

export function updateExpense(db: DatabaseType, expense: Expense) {
  const stmt = db.prepare(`
    UPDATE "Expenses"
    SET name = @name, price = @price, doneBy = @doneBy
    WHERE id = @id
  `);

  return stmt.run({
    id: expense.id,
    name: expense.name,
    price: expense.price,
    doneBy: expense.doneBy,
  });
}
// Funtion to get expenses of a particular date
export function getExpensesByDate(db: DatabaseType, date: string) {
  const stmt = db.prepare(`
    SELECT * FROM "Expenses"
    WHERE createdAt = @date
  `);
  return stmt.all({ date }) as Expense[];
}

export function getExpensesForFullDay(db: DatabaseType, date: string) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const stmt = db.prepare(`
    SELECT * FROM "Expenses"
    WHERE createdAt BETWEEN @startOfDay AND @endOfDay
  `);
  return stmt.all({
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
  }) as Expense[];
}
// //Function to get expenses of a particular month
// export function getExpensesByMonthAndYear(db: DatabaseType, year: string, month: string) {
//   const stmt = db.prepare(`
//     SELECT * FROM "Expenses"
//     WHERE strftime('%Y-%m', createdAt) = @yearMonth
//   `);
//   return stmt.all({ yearMonth: `${year}-${month}` }) as Expense[];
// }

// Function to delete an expense
export function deleteExpense(db: DatabaseType, id: number) {
  const stmt = db.prepare(`
    DELETE FROM "Expenses"
    WHERE id = @id
  `);

  return stmt.run({ id });
}
