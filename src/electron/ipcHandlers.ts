import { ipcMain } from "electron";
import RestaurantDB from "./database/index.js";
import { Order } from "./database/types.js";
import { printKitchenReceipt, printReceipt } from "./printer/printer.js";

ipcMain.handle("menu:add-item", async (event, item) => {
  try {
    return await RestaurantDB.addMenuItem(item);
  } catch (error) {
    console.error("Failed to add menu item:", error);
    throw error;
  }
});

ipcMain.handle("menu:get-items", async () => {
  try {
    return await RestaurantDB.getMenuItems();
  } catch (error) {
    console.error("Failed to get menu items:", error);
    throw error;
  }
});
// removeMenuItem
ipcMain.handle("menu:remove-item", async (event, id) => {
  try {
    return await RestaurantDB.deleteMenuItem(id);
  } catch (error) {
    console.error("Failed to remove menu item:", error);
    throw error;
  }
});
// updateMenuItem
ipcMain.handle("menu:update-item", async (event, item) => {
  try {
    return await RestaurantDB.updateMenuItem(item);
  } catch (error) {
    console.error("Failed to update menu item:", error);
    throw error;
  }
});

ipcMain.handle(
  "order:add-order",
  async (
    event,
    order: Omit<Order, "id" | "createdAt" | "updatedAt">,
    orderedItems: { menu_item_id: number; quantity: number }[]
  ) => {
    // console.log("order:add-order", order, orderedItems);
    try {
      return await RestaurantDB.addOrder(order, orderedItems);
    } catch (error) {
      console.error("Failed to add order:", error);
      throw error;
    }
  }
);

ipcMain.handle("order:get-orders", async () => {
  try {
    return await RestaurantDB.getOrders();
  } catch (error) {
    console.error("Failed to get orders:", error);
    throw error;
  }
});

ipcMain.handle("order:get-order-items", async (event, orderId) => {
  try {
    return await RestaurantDB.getOrderItems(orderId);
  } catch (error) {
    console.error("Failed to get order items:", error);
    throw error;
  }
});
// * revenue:get-monthly
ipcMain.handle(
  "revenue:get-monthly",
  async (event, year: number, month: number) => {
    try {
      return await RestaurantDB.getMonthlyRevenue(year, month);
    } catch (error) {
      console.error("Failed to get monthly revenue:", error);
      throw error;
    }
  }
);
// * revenue:get-daily
ipcMain.handle(
  "revenue:get-daily",
  async (event, year: number, month: number, day: number) => {
    try {
      return await RestaurantDB.getDailyRevenue(year, month, day);
    } catch (error) {
      console.error("Failed to get daily revenue:", error);
      throw error;
    }
  }
);
//* Printer

ipcMain.handle("order:print-receipt", async (event, data) => {
  try {
    const restaurantInfo = await RestaurantDB.getRestaurantInfo();
    await printReceipt(
      data,
      restaurantInfo.name,
      restaurantInfo.address,
      restaurantInfo.phone.join(", ")
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to print receipt:", error);
    //@ts-ignore
    return { success: false, error: error.message };
  }
});
ipcMain.handle("order:print-kitchen-receipt", async (event, data) => {
  try {
    const restaurantInfo = await RestaurantDB.getRestaurantInfo();
    await printKitchenReceipt(data);
    return { success: true };
  } catch (error) {
    console.error("Failed to print receipt:", error);
    //@ts-ignore
    return { success: false, error: error.message };
  }
});
// * Expenses
ipcMain.handle("expense:add-expense", async (event, expense) => {
  try {
    return await RestaurantDB.addExpense(expense);
  } catch (error) {
    console.error("Failed to add expense:", error);
    throw error;
  }
});
ipcMain.handle("expense:get-expenses", async () => {
  try {
    return await RestaurantDB.getExpenses();
  } catch (error) {
    console.error("Failed to get expenses:", error);
    throw error;
  }
});
ipcMain.handle("expense:update-expense", async (event, expense) => {
  try {
    return await RestaurantDB.updateExpense(expense);
  } catch (error) {
    console.error("Failed to update expense:", error);
    throw error;
  }
});
ipcMain.handle("expense:remove-expense", async (event, id) => {
  try {
    return await RestaurantDB.deleteExpense(id);
  } catch (error) {
    console.error("Failed to delete expense:", error);
    throw error;
  }
});
ipcMain.handle("expense:get-for-full-day", async (event, date) => {
  try {
    return await RestaurantDB.getExpensesForFullDay(date);
  } catch (error) {
    console.error("Failed to get expenses for full day:", error);
    throw error;
  }
});
ipcMain.handle("expense:get-monthly", async (event, year, month) => {
  try {
    return await RestaurantDB.getMonthlyExpenses(year, month);
  } catch (error) {
    console.error("Failed to get monthly expenses:", error);
    throw error;
  }
});

// * Restaurant Info
ipcMain.handle("restaurant:get-info", async () => {
  try {
    return await RestaurantDB.getRestaurantInfo();
  } catch (error) {
    console.error("Failed to get restaurant info:", error);
    throw error;
  }
});
ipcMain.handle("restaurant:update-info", async (event, info) => {
  try {
    return await RestaurantDB.updateRestaurantInfo(info);
  } catch (error) {
    console.error("Failed to update restaurant info:", error);
    throw error;
  }
});

//! Clear all the Data
ipcMain.handle("db:clear-all-data", async () => {
  try {
    return await RestaurantDB.clearData();
  } catch (error) {
    console.error("Failed to clear all data:", error);
    throw error;
  }
});
