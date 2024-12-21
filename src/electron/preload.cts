const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("restaurant", {
  menu: {
    addItem: (item: any) => ipcRenderer.invoke("menu:add-item", item),
    getItems: (): Promise<any> => ipcRenderer.invoke("menu:get-items"),
    deleteMenuItem: (id: number) => ipcRenderer.invoke("menu:remove-item", id),
    updateMenuItem: (item: any) => ipcRenderer.invoke("menu:update-item", item),
  },
  order: {
    addOrder: (order: any, orderedItems: any) =>
      ipcRenderer.invoke("order:add-order", order, orderedItems),
    getOrders: (): Promise<any> => ipcRenderer.invoke("order:get-orders"),
    getOrderItems: (orderId: string): Promise<any> =>
      ipcRenderer.invoke("order:get-order-items", orderId),
  },
});
