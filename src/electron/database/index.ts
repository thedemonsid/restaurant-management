import { initDatabase } from "./lib/init.js";
import {
  addMenuItem,
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
} from "./lib/menuItem.js";
import { addOrder, getOrders, getOrderItems } from "./lib/order.js";
import type { MenuItem, Order } from "./types.js";

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
  public close(): void {
    this.db.close();
  }
}

export default new RestaurantDB();
