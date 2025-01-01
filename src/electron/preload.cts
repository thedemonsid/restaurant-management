interface Order {
  id: number;
  tableName?: string;
  isParcel: boolean;
  amountPaid: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("restaurant", {
  menu: {
    addItem: (item: any) => ipcRenderer.invoke("menu:add-item", item),
    getItems: (): Promise<any> => ipcRenderer.invoke("menu:get-items"),
    deleteMenuItem: (id: number) => ipcRenderer.invoke("menu:remove-item", id),
    updateMenuItem: (item: any) => ipcRenderer.invoke("menu:update-item", item),
  },
  order: {
    addOrder: (
      order: Omit<Order, "id" | "createdAt" | "updatedAt">,
      orderedItems: { menu_item_id: number; quantity: number }[]
    ) => ipcRenderer.invoke("order:add-order", order, orderedItems),
    getOrders: (): Promise<any> => ipcRenderer.invoke("order:get-orders"),
    getOrderItems: (orderId: string): Promise<any> =>
      ipcRenderer.invoke("order:get-order-items", orderId),
    printReceipt: (data: any) =>
      ipcRenderer.invoke("order:print-receipt", data),
  },
  revenue: {
    getMonthlyRevenue: (year: number, month: number): Promise<any> =>
      ipcRenderer.invoke("revenue:get-monthly", year, month),
    getDailyRevenue: (year: number, month: number, day: number): Promise<any> =>
      ipcRenderer.invoke("revenue:get-daily", year, month, day),
  },
  expenses: {
    addExpense: (expense: any) =>
      ipcRenderer.invoke("expense:add-expense", expense),
    getExpenses: (): Promise<any> => ipcRenderer.invoke("expense:get-expenses"),
    deleteExpense: (id: number) =>
      ipcRenderer.invoke("expense:remove-expense", id),
    updateExpense: (expense: any) =>
      ipcRenderer.invoke("expense:update-expense", expense),
    getExpensesByDate: (date: string) =>
      ipcRenderer.invoke("expense:get-by-date", date),
    getExpensesForFullDay: (date: string) =>
      ipcRenderer.invoke("expense:get-for-full-day", date),
    getMonthlyExpenses: (year: number, month: number) =>
      ipcRenderer.invoke("expense:get-monthly", year, month),
  },
  restaurant: {
    getRestaurantInfo: (): Promise<any> =>
      ipcRenderer.invoke("restaurant:get-info"),
    updateRestaurantInfo: (info: any) =>
      ipcRenderer.invoke("restaurant:update-info", info),
  },
  db:{
    clearData: (): Promise<boolean> => ipcRenderer.invoke("db:clear-all-data"),
  }
});
