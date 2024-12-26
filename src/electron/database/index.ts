import {
  addExpense,
  deleteExpense,
  getExpenses,
  getExpensesForFullDay,
  updateExpense,
} from "./lib/expenses.js";
import { initDatabase } from "./lib/init.js";
import {
  addMenuItem,
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
} from "./lib/menuItem.js";
import { addOrder, getOrders, getOrderItems } from "./lib/order.js";
import type { Expense, MenuItem, Order } from "./types.js";

class RestaurantDB {
  private db = initDatabase();

  public addMenuItem(item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) {
    return addMenuItem(this.db, item);
  }

  public getMenuItems() {
    return getMenuItems(this.db);
  }
  public deleteMenuItem(id: number) {
    return deleteMenuItem(this.db, id);
  }
  public updateMenuItem(item: MenuItem) {
    return updateMenuItem(this.db, item);
  }

  //! Order related functions
  public addOrder(
    order: Omit<Order, "id" | "createdAt" | "updatedAt">,
    orderedItems: { menu_item_id: number; quantity: number }[]
  ) {
    return addOrder(this.db, order, orderedItems);
  }

  public getOrders() {
    return getOrders(this.db);
  }

  public getOrderItems(orderId: number) {
    return getOrderItems(this.db, orderId);
  }
  //! Revenue related functions
  public async getMonthlyRevenue(year: number, month: number) {
    const orders = await getOrders(this.db);
    const monthlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getFullYear() === year && orderDate.getMonth() === month - 1
      );
    });

    const monthlyRevenue = monthlyOrders.reduce((total, order) => {
      return total + order.amountPaid;
    }, 0);

    return monthlyRevenue;
  }
  public async getDailyRevenue(year: number, month: number, day: number) {
    const orders = await getOrders(this.db);
    const dailyOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getFullYear() === year &&
        orderDate.getMonth() === month - 1 &&
        orderDate.getDate() === day
      );
    });

    const dailyRevenue = dailyOrders.reduce((total, order) => {
      return total + order.amountPaid;
    }, 0);

    return dailyRevenue;
  }
  //! Expense related functions
  public addExpense(expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) {
    return addExpense(this.db, expense);
  }

  public getExpenses() {
    return getExpenses(this.db);
  }

  public updateExpense(expense: Expense) {
    return updateExpense(this.db, expense);
  }

  public deleteExpense(id: number) {
    return deleteExpense(this.db, id);
  }
  public getExpensesForFullDay(date: string) {
    return getExpensesForFullDay(this.db, date);
  }
  public async getMonthlyExpenses(year: number, month: number) {
    const expenses = await getExpenses(this.db);
    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.createdAt);
      return (
        expenseDate.getFullYear() === year &&
        expenseDate.getMonth() === month - 1
      );
    });

    const totalMonthlyExpenses = monthlyExpenses.reduce((total, expense) => {
      return total + expense.price;
    }, 0);

    return totalMonthlyExpenses;
  }

  //! Close the database connection
  public close(): void {
    this.db.close();
  }
}

export default new RestaurantDB();
