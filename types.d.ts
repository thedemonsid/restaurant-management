interface Window {
  restaurant: {
    menu: {
      addItem: (item: any) => Promise<void>;
      getItems: () => Promise<any>;
      deleteMenuItem: (id: number) => Promise<void>;
      updateMenuItem: (item: any) => Promise<void>;
    };
    order: {
      addOrder: (order: any, orderedItems: any) => Promise<void>;
      getOrders: () => Promise<any>;
      getOrderItems: (orderId: string) => Promise<any>;
    };
  };
}
