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

  public close(): void {
    this.db.close();
  }
}

export default new RestaurantDB();
