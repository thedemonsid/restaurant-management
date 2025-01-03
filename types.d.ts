interface Window {
  restaurant: {
    menu: {
      addItem: (item: any) => Promise<void>;
      getItems: () => Promise<any>;
      deleteMenuItem: (id: number) => Promise<void>;
      updateMenuItem: (item: any) => Promise<void>;
    };
    order: {
      addOrder: (order: any, orderedItems: any) => Promise<boolean>;
      getOrders: () => Promise<any>;
      getOrderItems: (orderId: number) => Promise<any>;
      printReceipt: (data: any) => void;
      printKitchenReceipt: (data: any) => void;
    };
    revenue: {
      getMonthlyRevenue: (year: number, month: number) => Promise<any>;
      getDailyRevenue: (
        year: number,
        month: number,
        day: number
      ) => Promise<any>;
    };
    expenses: {
      addExpense: (expense: any) => Promise<void>;
      getExpenses: () => Promise<any>;
      deleteExpense: (id: number) => Promise<void>;
      updateExpense: (expense: any) => Promise<any>;
      getExpensesByDate: (date: string) => Promise<any>;
      getExpensesForFullDay: (date: string) => Promise<any>;
      getMonthlyExpenses: (year: number, month: number) => Promise<any>;
    };
    restaurant: {
      getRestaurantInfo: () => Promise<{
        name: string;
        address: string;
        phone: string[];
      }>;
      updateRestaurantInfo: (restaurantInfo: {
        name: string;
        address: string;
        phone: string[];
      }) => Promise<boolean>;
    };
    db: {
      clearData: () => Promise<boolean>;
    };
  };
}
